import supabase from "./supabase";

export async function getDoctorTransactions(userId = 'all') {
    console.log('🔍 getDoctorTransactions called with userId:', userId);
    
    let query = supabase
        .from('doc_transactions')
        .select(`
            *,
            rentals!doc_transactions_rentalId_fkey(
                *,
                clinicId(name, address),
                docId(fullName, email),
                provId(fullName)
            )`)
        .order('created_at', { ascending: false });

    if (userId !== 'all') {
        query = query.eq('userId', userId);
    }

    console.log('📝 Query for doctor transactions:', query);
    const { data, error } = await query;

    if (error) {
        console.error('❌ Error getting doctor transactions:', error);
        console.error('📊 Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint
        });
        throw new Error('Error getting doctor transactions');
    }

    console.log('✅ Doctor transactions fetched successfully. Count:', data?.length);
    if (data?.length > 0) {
        console.log('📋 Sample data:', data[0]);
    }
    return data || [];
}

export async function getDoctorTransactionsThisMonth(userId = 'all') {
    console.log('📅 getDoctorTransactionsThisMonth called with userId:', userId);
    
    const now = new Date();
    // إصلاح حساب التواريخ
    const startOfCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const endOfCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    console.log('📅 Corrected date range for query:', {
        start: startOfCurrentMonth.toISOString(),
        end: endOfCurrentMonth.toISOString(),
        now: now.toISOString()
    });

    let query = supabase
        .from('doc_transactions')
        .select('*')
        .gte('created_at', startOfCurrentMonth.toISOString())
        .lte('created_at', endOfCurrentMonth.toISOString())
        .order('created_at', { ascending: false });

    if (userId !== 'all') {
        query = query.eq('userId', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('❌ Error getting doctor transactions for this month:', error);
        throw new Error('Error getting doctor transactions for this month');
    }

    console.log('✅ This month transactions count:', data?.length);
    return data || [];
}

export async function createProviderWithdrawalWithTransaction(withdrawalData) {
    console.log('💳 createProviderWithdrawalWithTransaction called with data:', withdrawalData);
    
    const { userId, amount, payment_method, method_id, status } = withdrawalData;

    // Validate required fields
    if (!userId || !amount || !payment_method) {
        console.error('❌ Missing required fields:', { userId, amount, payment_method });
        throw new Error('Missing required fields for withdrawal');
    }

    console.log('🔄 Creating payout record...');
    const { data: withdrawal, error: withdrawalError } = await supabase
        .from('payouts')
        .insert([{
            userId,
            amount,
            payment_method,
            status
        }])
        .select()
        .single();

    if (withdrawalError) {
        console.error('❌ Error creating provider withdrawal:', withdrawalError);
        console.error('📊 Withdrawal error details:', {
            message: withdrawalError.message,
            details: withdrawalError.details,
            hint: withdrawalError.hint
        });
        throw new Error('Error creating provider withdrawal');
    }

    console.log('✅ Payout created:', withdrawal);

    console.log('🔄 Creating provider transaction record...');
    const { data: transactionData, error: transactionError } = await supabase
        .from('prov_transactions')
        .insert([{
            userId,
            service: 'Withdrawal',
            amount: amount,
            type: 'withdrawal',
            method_id,
            status: status || 'pending'
        }])
        .select()
        .single();

    if (transactionError) {
        console.error('❌ Error creating provider transaction:', transactionError);
        console.error('📊 Transaction error details:', {
            message: transactionError.message,
            details: transactionError.details,
            hint: transactionError.hint
        });
        
        // Rollback payout if transaction fails
        console.log('🔄 Rolling back payout due to transaction error...');
        await supabase.from('payouts').delete().eq('id', withdrawal.id);
        throw new Error('Error creating provider transaction');
    }

    console.log('✅ Transaction created:', transactionData);
    console.log('🎉 Withdrawal process completed successfully');

    return {
        withdrawal: withdrawal,
        transaction: transactionData
    };
}

export async function getProviderTransactions(userId = 'all', options = {}) {
    console.log('🔍 getProviderTransactions called with:', { userId, options });
    
    const {
        page = 1,
        pageSize = 10,
        search = '',
        type = 'all',
        status = 'all',
        sortBy = 'created_at',
        sortOrder = 'desc',
        date = ''
    } = options;

    // تنظيف القيم الفارغة
    const cleanType = type?.trim() || 'all';
    const cleanStatus = status?.trim() || 'all';
    const cleanSearch = search?.trim() || '';

    console.log('🔧 Cleaned filters:', { 
        type: cleanType, 
        status: cleanStatus, 
        search: cleanSearch 
    });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    console.log('📊 Pagination settings:', { page, pageSize, from, to });

    let query = supabase
        .from('prov_transactions')
        .select(`
            *,
            user:users!prov_transactions_userId_fkey(fullName, email, userId, phone),
            method:payment_methods!prov_transactions_method_id_fkey(type, end_numbers, method_details)
        `, { count: 'exact' });

    if (userId !== 'all') {
        query = query.eq('userId', userId);
    }

    if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
        console.log('📅 Date filter:', { date, start: start.toISOString(), end: end.toISOString() });
        query = query.gte('created_at', start.toISOString()).lt('created_at', end.toISOString());
    }

    if (cleanSearch) {
        console.log('🔎 Search filter:', cleanSearch);
        query = query.or(`service.ilike.%${cleanSearch}%,type.ilike.%${cleanSearch}%`);
    }

    if (cleanType !== 'all') {
        console.log('📋 Type filter:', cleanType);
        query = query.eq('type', cleanType);
    }

    if (cleanStatus !== 'all') {
        console.log('📋 Status filter:', cleanStatus);
        query = query.eq('status', cleanStatus);
    }

    console.log('📝 Final query parameters:', { sortBy, sortOrder });
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('❌ Error getting provider transactions:', error);
        console.error('📊 Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint
        });
        throw new Error('Error getting provider transactions');
    }

    const result = {
        data: data || [],
        totalCount: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };

    console.log('✅ Provider transactions fetched successfully:', {
        dataCount: data?.length,
        totalCount: count,
        hasData: data && data.length > 0
    });
    
    if (data?.length > 0) {
        console.log('📋 Sample provider transaction:', data[0]);
    }
    
    return result;
}

export async function updateTransactionStatus(transactionId, status, type = 'doctor') {
    console.log('🔄 updateTransactionStatus called:', { transactionId, status, type });
    
    const table = type === 'doctor' ? 'doc_transactions' : 'prov_transactions';
    
    console.log(`📊 Updating ${table} table for transaction:`, transactionId);
    
    const { data, error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', transactionId)
        .select()
        .single();

    if (error) {
        console.error(`❌ Error updating ${type} transaction status:`, error);
        console.error('📊 Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint
        });
        throw new Error(`Error updating ${type} transaction status`);
    }

    console.log('✅ Transaction status updated successfully:', data);
    return data;
}

// دالة جديدة لجلب بيانات payouts مع فلترة وترتيب
export async function getPayouts(userId = 'all', options = {}) {
    console.log('🔍 getPayouts called with:', { userId, options });
    
    const {
        page = 1,
        pageSize = 10,
        status = 'all',
        search = ''
    } = options;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from('payouts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (userId !== 'all') {
        query = query.eq('userId', userId);
    }

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    if (search) {
        query = query.or(`userId.ilike.%${search}%,payment_method.ilike.%${search}%`);
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('❌ Error getting payouts:', error);
        throw new Error('Error getting payouts');
    }

    const result = {
        data: data || [],
        totalCount: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };

    console.log('✅ Payouts fetched successfully:', result);
    return result;
}

// دالة جديدة لتحديث حالة payout
export async function updatePayoutStatus(payoutId, status) {
    console.log('🔄 updatePayoutStatus called:', { payoutId, status });
    
    const { data, error } = await supabase
        .from('payouts')
        .update({ status })
        .eq('id', payoutId)
        .select()
        .single();

    if (error) {
        console.error('❌ Error updating payout status:', error);
        throw new Error('Error updating payout status');
    }

    console.log('✅ Payout status updated successfully:', data);
    return data;
}

export async function getFinancialStats() {
    console.log('📈 getFinancialStats called');
    
    // Get completed rentals with their fees
    const { data: rentals, error: rentalsError } = await supabase
      .from('rentals')
      .select(`
        id,
        price,
        status,
        platform_fee_percentage,
        provider_share,
        platform_fee,
        created_at,
        payment_status
      `)
      .eq('status', 'completed')
      .eq('payment_status', 'paid');

    // Get current platform fee from settings
    const { data: feeSettings } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'platform_fee')
      .single();

    if (rentalsError) {
        console.error('❌ Error getting rentals:', rentalsError);
        throw new Error('Error getting financial stats');
    }

    const currentPlatformFee = feeSettings?.value || 20;

    // Calculate totals
    const totalRevenue = rentals.reduce((sum, rental) => sum + (rental.price || 0), 0);
    
    // Calculate monthly revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthlyRentals = rentals.filter(rental => 
        new Date(rental.created_at) >= new Date(startOfMonth)
    );
    const monthlyRevenue = monthlyRentals.reduce((sum, rental) => sum + (rental.price || 0), 0);

    // Calculate platform fees (commission)
    const platformFees = rentals.reduce((sum, rental) => 
        sum + (rental.platform_fee || (rental.price * (rental.platform_fee_percentage || currentPlatformFee) / 100)), 
        0
    );

    // Calculate provider payouts
    const providerPayouts = rentals.reduce((sum, rental) => 
        sum + (rental.provider_share || (rental.price * (100 - (rental.platform_fee_percentage || currentPlatformFee)) / 100)),
        0
    );

    const stats = {
        totalRevenue,
        monthlyRevenue,
        platformFees,
        providerPayouts,
        totalBookings: rentals.length,
        platformFeePercentage: currentPlatformFee,
        completedBookings: rentals.length
    };

    console.log('✅ Financial stats calculated:', stats);
    return stats;
}

export async function getBookingAnalytics() {
    console.log('📈 Getting booking analytics...');
    
    // Get completed rentals with their fees
    const { data: rentals, error: rentalsError } = await supabase
        .from('rentals')
        .select(`
            id,
            price,
            status,
            platform_fee_percentage,
            provider_share,
            platform_fee,
            created_at,
            payment_status
        `)
        .order('created_at', { ascending: false });

    if (rentalsError) {
        console.error('❌ Error getting booking analytics:', rentalsError);
        throw new Error('Error getting booking analytics');
    }

    // Get current platform fee from settings
    const { data: feeSettings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'platform_fee')
        .single();

    const currentPlatformFee = feeSettings?.value || 20;

    // Calculate analytics
    const completedPaidRentals = rentals.filter(r => 
        r.status === 'completed' && r.payment_status === 'paid'
    );

    const totalRevenue = completedPaidRentals.reduce((sum, rental) => 
        sum + (rental.price || 0), 0
    );
    
    // Calculate monthly revenue
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthlyRentals = completedPaidRentals.filter(rental => 
        new Date(rental.created_at) >= new Date(monthStart)
    );
    const monthlyRevenue = monthlyRentals.reduce((sum, rental) => 
        sum + (rental.price || 0), 0
    );

    // Calculate commission and payouts
    const commission = completedPaidRentals.reduce((sum, rental) => 
        sum + (rental.platform_fee || (rental.price * (rental.platform_fee_percentage || currentPlatformFee) / 100)), 
        0
    );

    const pendingPayouts = rentals
        .filter(r => r.status === 'completed' && r.payment_status === 'paid')
        .reduce((sum, rental) => 
            sum + (rental.provider_share || (rental.price * (100 - (rental.platform_fee_percentage || currentPlatformFee)) / 100)),
            0
        );

    return {
        totalRevenue,
        monthlyRevenue,
        commission,
        pendingPayouts,
        platformFeePercentage: currentPlatformFee,
        totalBookings: rentals.length,
        completedBookings: rentals.filter(r => r.status === 'completed').length,
        paidBookings: rentals.filter(r => r.payment_status === 'paid').length
    };
}

export async function getBookingStats() {
    console.log('📊 Getting booking stats...');
    
    const { data: rentals, error } = await supabase
        .from('rentals')
        .select('status, payment_status');

    if (error) {
        console.error('❌ Error getting booking stats:', error);
        throw new Error('Error getting booking stats');
    }

    return {
        total: rentals.length,
        completed: rentals.filter(r => r.status === 'completed').length,
        pending: rentals.filter(r => r.status === 'pending').length,
        confirmed: rentals.filter(r => r.status === 'confirmed').length,
        cancelled: rentals.filter(r => r.status === 'cancelled').length,
        paid: rentals.filter(r => r.payment_status === 'paid').length,
        unpaid: rentals.filter(r => r.payment_status === 'unpaid').length
    };
}

export async function getRecentBookings(limit = 5) {
    console.log('📋 Getting recent bookings...');
    
    const { data, error } = await supabase
        .from('rentals')
        .select(`
            *,
            docId:users!rentals_docId_fkey (fullName, email),
            provId:users!rentals_provId_fkey (fullName),
            clinicId:clinics (name, address)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('❌ Error getting recent bookings:', error);
        throw new Error('Error getting recent bookings');
    }

    return data;
}

// دالة لتحديث نسبة عمولة المنصة
export async function updatePlatformFee(newFee) {
    console.log('💰 Updating platform fee to:', newFee);
    
    const { data, error } = await supabase
        .from('settings')
        .upsert({ 
            key: 'platform_fee',
            value: newFee,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Error updating platform fee:', error);
        throw new Error('Error updating platform fee');
    }

    return data;
}

// دالة جديدة لإنشاء بيانات تجريبية (للتطوير فقط)
export async function createSampleData() {
    console.log('🎨 Creating sample data for development...');
    
    // إنشاء بيانات تجريبية للـ doc_transactions
    const sampleDoctorTransactions = [
        {
            rentalId: 1,
            status: 'completed',
            userId: 'user1',
            amount: 15000
        },
        {
            rentalId: 2,
            status: 'pending',
            userId: 'user2',
            amount: 20000
        },
        {
            rentalId: 3,
            status: 'completed',
            userId: 'user1',
            amount: 12000
        }
    ];

    const { data: createdDoctorTransactions, error: doctorError } = await supabase
        .from('doc_transactions')
        .insert(sampleDoctorTransactions)
        .select();

    if (doctorError) {
        console.error('❌ Error creating sample doctor transactions:', doctorError);
    } else {
        console.log('✅ Sample doctor transactions created:', createdDoctorTransactions);
    }

    return {
        doctorTransactions: createdDoctorTransactions || []
    };
}
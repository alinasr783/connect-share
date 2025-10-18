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
        .select('*', { count: 'exact' });

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
    
    console.log('🔄 Fetching doctor transactions...');
    const { data: doctorTransactions, error: doctorError } = await supabase
        .from('doc_transactions')
        .select('status, created_at, amount');

    console.log('🔄 Fetching provider transactions...');
    const { data: providerTransactions, error: providerError } = await supabase
        .from('prov_transactions')
        .select('amount, type, status, created_at');

    console.log('🔄 Fetching payouts...');
    const { data: payouts, error: payoutsError } = await supabase
        .from('payouts')
        .select('amount, status');

    if (doctorError || providerError || payoutsError) {
        console.error('❌ Error getting financial stats:', { doctorError, providerError, payoutsError });
        throw new Error('Error getting financial stats');
    }

    console.log('📊 Raw data counts:', {
        doctorTransactions: doctorTransactions?.length,
        providerTransactions: providerTransactions?.length,
        payouts: payouts?.length
    });

    const totalRevenue = doctorTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const monthlyRevenue = doctorTransactions
        .filter(t => {
            const transactionDate = new Date(t.created_at);
            const now = new Date();
            return transactionDate.getMonth() === now.getMonth() &&
                transactionDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const pendingPayouts = payouts.filter(t => t.status === 'pending').length;
    const totalPayouts = payouts.reduce((sum, t) => sum + (Math.abs(t.amount) || 0), 0);

    const stats = {
        totalRevenue,
        monthlyRevenue,
        pendingPayouts,
        totalPayouts,
        totalTransactions: doctorTransactions.length + providerTransactions.length,
        completedTransactions: doctorTransactions.filter(t => t.status === 'completed').length +
            providerTransactions.filter(t => t.status === 'completed').length
    };

    console.log('✅ Financial stats calculated:', stats);
    return stats;
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
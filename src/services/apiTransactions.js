import supabase from "./supabase";

export async function getDoctorTransactions(userId = 'all') {
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

    const { data, error } = await query;

    if (error) {
        console.error('Error getting doctor transactions:', error);
        throw new Error('Error getting doctor transactions');
    }

    return data || [];
}

export async function getDoctorTransactionsThisMonth(userId = 'all') {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

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
        console.error('Error getting doctor transactions for this month:', error);
        throw new Error('Error getting doctor transactions for this month');
    }

    return data || [];
}

export async function createProviderWithdrawalWithTransaction(withdrawalData) {
    const { userId, amount, payment_method, method_id, status } = withdrawalData;

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
        console.error('Error creating provider withdrawal:', withdrawalError);
        throw new Error('Error creating provider withdrawal');
    }

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
        console.error('Error creating provider transaction:', transactionError);
        throw new Error('Error creating provider transaction');
    }

    return {
        withdrawal: withdrawal,
        transaction: transactionData
    };
}

export async function getProviderTransactions(userId = 'all', options = {}) {
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

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

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
        query = query.gte('created_at', start.toISOString()).lt('created_at', end.toISOString());
    }

    if (search) {
        query = query.ilike('service', `%${search}%`);
    }

    if (type !== 'all') {
        query = query.eq('type', type);
    }

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error getting provider transactions:', error);
        throw new Error('Error getting provider transactions');
    }

    return {
        data: data || [],
        totalCount: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}

export async function updateTransactionStatus(transactionId, status, type = 'doctor') {
    const table = type === 'doctor' ? 'doc_transactions' : 'prov_transactions';
    
    const { data, error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', transactionId)
        .select()
        .single();

    if (error) {
        console.error(`Error updating ${type} transaction status:`, error);
        throw new Error(`Error updating ${type} transaction status`);
    }

    return data;
}

export async function getFinancialStats() {
    const { data: doctorTransactions, error: doctorError } = await supabase
        .from('doc_transactions')
        .select('status, created_at, amount');

    const { data: providerTransactions, error: providerError } = await supabase
        .from('prov_transactions')
        .select('amount, type, status, created_at');

    if (doctorError || providerError) {
        console.error('Error getting financial stats:', { doctorError, providerError });
        throw new Error('Error getting financial stats');
    }

    const totalRevenue = doctorTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const monthlyRevenue = doctorTransactions
        .filter(t => {
            const transactionDate = new Date(t.created_at);
            const now = new Date();
            return transactionDate.getMonth() === now.getMonth() &&
                transactionDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const pendingPayouts = providerTransactions.filter(t => t.status === 'pending').length;
    const totalPayouts = providerTransactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
        totalRevenue,
        monthlyRevenue,
        pendingPayouts,
        totalPayouts,
        totalTransactions: doctorTransactions.length + providerTransactions.length,
        completedTransactions: doctorTransactions.filter(t => t.status === 'completed').length +
            providerTransactions.filter(t => t.status === 'completed').length
    };
}
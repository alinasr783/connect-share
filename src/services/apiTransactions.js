import supabase from "./supabase";

export async function getDoctorTransactions(userId) {
    const { data, error } = await supabase
        .from('doc_transactions')
        .select(`
            *,
            rentals!doc_transactions_rentalId_fkey(
                *,
                clinicId(name),
                docId(fullName),
                provId(fullName),
                selected_pricing
            )`)
        .eq('userId', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        throw new Error('Error getting doctor transactions');
    }

    return data;
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
        console.error(withdrawalError);
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
        console.error(transactionError);
        throw new Error('Error creating provider transaction');
    }

    return {
        withdrawal: withdrawal,
        transaction: transactionData
    };
}

export async function getProviderTransactions(userId, options = {}) {
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
        .select('*', { count: 'exact' })
        .eq('userId', userId);
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
        console.error(error);
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
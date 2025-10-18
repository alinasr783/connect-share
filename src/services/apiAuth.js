import supabase from "./supabase";
import { uploadSyndicateCard } from "./apiStorage";

export async function signup({ fullName, email, phone, userType, password, syndicateCardFile, specialties }) {
    try {
        // 1. Check if user already exists
        const { data: existingUser, error: userCheckError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userCheckError && userCheckError.code !== 'PGRST116') {
            throw new Error('Error checking for existing user');
        }

        if (existingUser) {
            throw new Error('User with this email already exists. Please log in.');
        }

        // 2. Create auth user
        const authUserData = {
            fullName,
            userType,
            avatar: '',
            phone: phone, // إضافة رقم الموبايل هنا
            medicalLicenseNumber: '',
            status: userType === 'doctor' ? 'inactive' : 'active', // Doctors start as inactive
        };

        // Add doctor-specific data
        if (userType === 'doctor') {
            authUserData.syndicateCardImage = '';
            authUserData.specialties = specialties || [];
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: authUserData,
            },
        });

        if (authError) throw new Error(authError.message || 'Error creating authentication user');

        // 3. Create user in users table
        const userInsertData = {
            userId: authData.user.id,
            email,
            fullName,
            userType,
            phone: phone, // إضافة رقم الموبايل هنا
            status: userType === 'doctor' ? 'inactive' : 'active', // Doctors start as inactive
        };

        // Add doctor-specific fields if user is a doctor
        if (userType === 'doctor') {
            userInsertData.medicalLicenseNumber = '';
            userInsertData.syndicate_card = ''; // Will be updated after upload
            userInsertData.specialties = specialties || [];
        }

        const { error: userError } = await supabase
            .from('users')
            .insert([userInsertData]);

        if (userError) throw new Error('Error creating user profile: ' + userError.message);

        // Upload syndicate card image (required for doctors)
        if (userType === 'doctor') {
            if (!syndicateCardFile) {
                throw new Error('Syndicate card image is required for doctors');
            }
            try {
                const syndicateCardImageUrl = await uploadSyndicateCard(syndicateCardFile, authData.user.id);

                // Update auth user metadata with image URL
                await supabase.auth.updateUser({
                    data: {
                        syndicate_card: syndicateCardImageUrl,
                    },
                });

                // Update users table with image URL
                await supabase
                    .from('users')
                    .update({
                        syndicate_card: syndicateCardImageUrl,
                    })
                    .eq('userId', authData.user.id);
            } catch (uploadError) {
                console.error('Error uploading syndicate card:', uploadError);
                throw new Error('Failed to upload syndicate card image: ' + uploadError.message);
            }
        }

        return authData;
    } catch (error) {
        console.error('Signup error:', error);
        throw new Error(error.message || 'An error occurred during signup');
    }
}

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw new Error('there was an error logging in')

    return data
}

export async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) throw new Error('Error logging out: ' + error.message);

    return { success: true };
}

export async function getCurrentUser() {
    // Get the current session which includes user data
    const { data: session, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Session error:', error);
        throw new Error('Error getting session: ' + error.message);
    }

    // If no session, return null
    if (!session?.session?.user) return null;

    // Return the user from the session (no need for additional API call)
    return session.session.user;
}

export async function updateCurrentUser({ fullName, phone, avatar, medicalLicenseNumber, specialties }) {
    // Get current user to get the userId
    const { data: currentUser, error: userError } = await supabase.auth.getUser();

    if (userError) throw new Error('Error getting current user: ' + userError.message);
    if (!currentUser.user) throw new Error('No authenticated user found');

    let avatarUrl = avatar; // Default to existing avatar or empty string

    // If avatar is provided and it's base64 data, upload to storage
    if (avatar && avatar.startsWith('data:image/')) {
        try {
            // Convert base64 to blob
            const response = await fetch(avatar);
            const blob = await response.blob();

            // Create unique filename
            const fileExt = avatar.split(';')[0].split('/')[1];
            const fileName = `${currentUser.user.id}-${Date.now()}.${fileExt}`;

            // Upload to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from('avtars')
                .upload(fileName, blob, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw new Error('Error uploading avatar: ' + uploadError.message);

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('avtars')
                .getPublicUrl(fileName);

            avatarUrl = urlData.publicUrl;
        } catch (error) {
            throw new Error('Error processing avatar: ' + error.message);
        }
    }

    // Update auth user metadata
    const updateData = {
        fullName,
        phone,
        avatar: avatarUrl,
    };

    // Add doctor-specific fields if provided
    if (medicalLicenseNumber !== undefined) {
        updateData.medicalLicenseNumber = medicalLicenseNumber;
    }
    if (specialties !== undefined) {
        updateData.specialties = specialties;
    }

    const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: updateData,
    });

    if (authError) throw new Error('Error updating auth user: ' + authError.message);

    // Update users table
    const usersTableUpdateData = {
        fullName,
        phone,
    };

    // Add doctor-specific fields if provided
    if (medicalLicenseNumber !== undefined) {
        usersTableUpdateData.medicalLicenseNumber = medicalLicenseNumber;
    }
    if (specialties !== undefined) {
        usersTableUpdateData.specialties = specialties;
    }

    const { error: usersTableError } = await supabase
        .from('users')
        .update(usersTableUpdateData)
        .eq('userId', currentUser.user.id);

    if (usersTableError) throw new Error('Error updating users table: ' + usersTableError.message);

    return authData;
}

export async function updatePassword({ currentPassword, newPassword }) {
    try {
        // First, verify the current password by attempting to sign in
        const { data: currentUser, error: userError } = await supabase.auth.getUser();

        if (userError) throw new Error('Error getting current user: ' + userError.message);
        if (!currentUser.user) throw new Error('No authenticated user found');

        // Verify current password by attempting to sign in with it
        const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: currentUser.user.email,
            password: currentPassword,
        });

        if (verifyError) {
            throw new Error('Current password is incorrect');
        }

        // Update the password
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw new Error('Error updating password: ' + error.message);

        return data;
    } catch (error) {
        console.error('Password update error:', error);
        throw new Error(error.message || 'An error occurred while updating password');
    }
}
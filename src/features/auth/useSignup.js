import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signup as signupApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

function useSignup() {
    const navigate = useNavigate();

    const { mutateAsync: signUp, isPending: isSignUpPending } = useMutation({
        mutationFn: signupApi,

        onSuccess: (user) => {
            console.log(user);
            toast.success("Signup successful");
            navigate("/dashboard");
        },

        onError: (error) => {
            toast.error(error.message);
        },
    })

    return { signUp, isSignUpPending }
}

export default useSignup;
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

function useLogin() {
    const navigate = useNavigate();

    const { mutateAsync: login, isPending: isLoginPending } = useMutation({
        mutationFn: loginApi,

        onSuccess: () => {
            toast.success("Login successful");

            navigate("/dashboard");
        },

        onError: (error) => {
            console.log(error);
            toast.error('Provider email or password is incorrect');
        },
    })

    return { login, isLoginPending }
}

export default useLogin;
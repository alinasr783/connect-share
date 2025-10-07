import {useState} from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import useUser from "../auth/useUser";
import useCreatePaymentMethods from "./useCreatePaymentMethods";

function AddPaymentMethodModal({onClose}) {
  const {user} = useUser();
  const {createPaymentMethod, isCreating} = useCreatePaymentMethods();

  const [type, setType] = useState("bank");
  const [bank, setBank] = useState({
    bank_name: "",
    account_holder: "",
    account_number: "",
    swift: "",
  });
  const [wallet, setWallet] = useState({
    email: "",
    wallet_id: "",
    provider: "",
  });

  function submit(e) {
    e.preventDefault();
    const details = type === "bank" ? bank : wallet;
    const end_numbers =
      type === "bank"
        ? (bank.account_number || "").slice(-4)
        : (wallet.wallet_id || wallet.email || "").slice(-4);

    const payload = {
      userId: user?.id,
      type,
      end_numbers,
      method_details: details,
    };

    createPaymentMethod(payload, {
      onSuccess: () => onClose?.(),
    });
  }

  return (
    <Modal title="Add payment method" onClose={onClose} type="small" isOpen>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType("bank")}
              className={`px-4 py-2 rounded-lg border ${
                type === "bank"
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-700"
              }`}>
              Bank
            </button>
            <button
              type="button"
              onClick={() => setType("wallet")}
              className={`px-4 py-2 rounded-lg border ${
                type === "wallet"
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-700"
              }`}>
              Wallet
            </button>
          </div>
        </div>

        {type === "bank" ? (
          <div className="space-y-4">
            <Field label="Bank name">
              <Input
                value={bank.bank_name}
                onChange={(e) => setBank({...bank, bank_name: e.target.value})}
              />
            </Field>
            <Field label="Account holder">
              <Input
                value={bank.account_holder}
                onChange={(e) =>
                  setBank({...bank, account_holder: e.target.value})
                }
              />
            </Field>
            <Field label="Account number">
              <Input
                value={bank.account_number}
                onChange={(e) =>
                  setBank({...bank, account_number: e.target.value})
                }
              />
            </Field>
            <Field label="SWIFT / IBAN (optional)">
              <Input
                value={bank.swift}
                onChange={(e) => setBank({...bank, swift: e.target.value})}
              />
            </Field>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Wallet email">
              <Input
                value={wallet.email}
                onChange={(e) => setWallet({...wallet, email: e.target.value})}
              />
            </Field>
            <Field label="Wallet ID">
              <Input
                value={wallet.wallet_id}
                onChange={(e) =>
                  setWallet({...wallet, wallet_id: e.target.value})
                }
              />
            </Field>
            <Field label="Provider (PayPal, Skrill…)">
              <Input
                value={wallet.provider}
                onChange={(e) =>
                  setWallet({...wallet, provider: e.target.value})
                }
              />
            </Field>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variation="secondary" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button variation="primary" disabled={isCreating}>
            Save method
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({label, children}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props) {
  return <input className="input" {...props} />;
}

export default AddPaymentMethodModal;

import Button from "../../ui/Button";

function maskEndNumbers(end) {
  const endStr = String(end || "").trim();
  if (!endStr) return "";
  return `**** ${endStr.slice(-4)}`;
}

function getIconAndLabel(type, details) {
  const normalized = String(type || "").toLowerCase();
  if (normalized === "bank" || normalized === "bank_transfer") {
    const label = "Bank Transfer";
    const sub = details?.account_holder || details?.bank_name;
    return {icon: "ri-bank-line", label, subLabel: sub};
  }

  if (normalized === "wallet" || normalized === "digital_wallet") {
    const label = "Digital Wallet";
    const sub = details?.email || details?.wallet_id;
    return {icon: "ri-wallet-3-line", label, subLabel: sub};
  }

  if (normalized === "card") {
    const label = "Card";
    const sub = details?.brand || details?.network;
    return {icon: "ri-bank-card-line", label, subLabel: sub};
  }

  const label = "Payment Method";
  return {icon: "ri-money-dollar-circle-line", label, subLabel: undefined};
}

function PaymentMethodItem({method}) {
  const {
    type,
    end_numbers: endNumbers,
    method_details: methodDetails,
  } = method || {};
  const details =
    typeof methodDetails === "string"
      ? safeParse(methodDetails)
      : methodDetails;
  const meta = getIconAndLabel(type, details);

  return (
    <div
      className="flex items-center justify-between p-4 
        bg-white rounded-xl border border-gray-200">
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-lg bg-gray-100 flex 
            items-center justify-center text-gray-600">
          <i className={`${meta.icon} text-xl`}></i>
        </div>
        <div>
          <div className="font-semibold text-gray-800">{meta.label}</div>
          <div className="text-sm text-gray-500">
            {meta.subLabel ? (
              <span className="mr-2">{meta.subLabel}</span>
            ) : null}
            {endNumbers ? (
              <span>Account ending in {maskEndNumbers(endNumbers)}</span>
            ) : null}
          </div>
        </div>
      </div>

      <ManageMenu method={method} />
    </div>
  );
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default PaymentMethodItem;

import {DropdownMenu, MenuItem, MenuSeparator} from "../../ui/DropdownMenu";
import {useState, Fragment} from "react";
import Modal from "../../ui/Modal";
import useUpdateMethod from "./useUpdateMethod";
import useDeleteMethod from "./useDeleteMethod";

function ManageMenu({method}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {deleteMethod, isDeleting} = useDeleteMethod();

  return (
    <Fragment>
      <DropdownMenu
        trigger={
          <Button variation="link" size="small">
            Manage
          </Button>
        }
        position="right">
        <MenuItem icon="ri-edit-2-line" onClick={() => setIsEditOpen(true)}>
          Edit
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          icon="ri-delete-bin-6-line"
          onClick={() => deleteMethod(method.id)}
          disabled={isDeleting}>
          Delete
        </MenuItem>
      </DropdownMenu>

      {isEditOpen && (
        <EditPaymentMethodModal
          method={method}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </Fragment>
  );
}

function EditPaymentMethodModal({method, onClose}) {
  const [type, setType] = useState(method.type);
  const initialDetails =
    typeof method.method_details === "string"
      ? safeParse(method.method_details)
      : method.method_details;
  const [details, setDetails] = useState(initialDetails || {});
  const {updateMethod, isUpdating} = useUpdateMethod();

  function submit(e) {
    e.preventDefault();
    const end_numbers =
      type === "bank"
        ? String(details.account_number || "").slice(-4)
        : String(details.wallet_id || details.email || "").slice(-4);

    updateMethod(
      {id: method.id, updates: {type, method_details: details, end_numbers}},
      {onSuccess: () => onClose?.()}
    );
  }

  return (
    <Modal title="Edit payment method" onClose={onClose} type="small" isOpen>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType("bank")}
              className={`px-3 py-1.5 rounded border ${
                type === "bank"
                  ? "border-primary text-primary"
                  : "border-gray-300"
              }`}>
              Bank
            </button>
            <button
              type="button"
              onClick={() => setType("wallet")}
              className={`px-3 py-1.5 rounded border ${
                type === "wallet"
                  ? "border-primary text-primary"
                  : "border-gray-300"
              }`}>
              Wallet
            </button>
          </div>
        </div>

        {type === "bank" ? (
          <div className="space-y-4">
            <Field label="Bank name">
              <Input
                value={details.bank_name || ""}
                onChange={(e) =>
                  setDetails({...details, bank_name: e.target.value})
                }
              />
            </Field>
            <Field label="Account holder">
              <Input
                value={details.account_holder || ""}
                onChange={(e) =>
                  setDetails({...details, account_holder: e.target.value})
                }
              />
            </Field>
            <Field label="Account number">
              <Input
                value={details.account_number || ""}
                onChange={(e) =>
                  setDetails({...details, account_number: e.target.value})
                }
              />
            </Field>
            <Field label="SWIFT / IBAN">
              <Input
                value={details.swift || ""}
                onChange={(e) =>
                  setDetails({...details, swift: e.target.value})
                }
              />
            </Field>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Wallet email">
              <Input
                value={details.email || ""}
                onChange={(e) =>
                  setDetails({...details, email: e.target.value})
                }
              />
            </Field>
            <Field label="Wallet ID">
              <Input
                value={details.wallet_id || ""}
                onChange={(e) =>
                  setDetails({...details, wallet_id: e.target.value})
                }
              />
            </Field>
            <Field label="Provider">
              <Input
                value={details.provider || ""}
                onChange={(e) =>
                  setDetails({...details, provider: e.target.value})
                }
              />
            </Field>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variation="secondary" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button variation="primary" disabled={isUpdating}>
            Save changes
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

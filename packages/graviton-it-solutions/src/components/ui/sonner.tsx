import { toast, notify } from "@/lib/sweetalert";

type ToasterProps = Record<string, unknown>;

const Toaster = (_props: ToasterProps = {}) => {
  void _props;
  return null;
};

export { Toaster, toast, notify };

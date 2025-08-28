import { create } from 'zustand';

type VapiSecretsStore = {
  publicKey: string | null;
  actions: {
    setPublicKey: (publicKey: string | null) => void;
  };
};

const useVapiSecretsStore = create<VapiSecretsStore>((set) => ({
  publicKey: null,
  actions: {
    setPublicKey: (publicKey: string | null) => set({ publicKey })
  }
}));

export const useVapiSecrets = () =>
  useVapiSecretsStore((state) => state.publicKey);
export const useVapiSecretsActions = () =>
  useVapiSecretsStore((state) => state.actions);

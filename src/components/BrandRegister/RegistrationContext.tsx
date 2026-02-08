"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  RegistrationState,
  RegistrationStep,
  RegistrationFormData,
} from "@/types/brand-registration";

type RegistrationContextType = RegistrationState & {
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: RegistrationStep) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export function useRegistration(): RegistrationContextType {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }
  return context;
}

const initialState: RegistrationState = {
  currentStep: 1,
  formData: {},
  isSubmitting: false,
  error: null,
};

type RegistrationProviderProps = {
  children: ReactNode;
};

export function RegistrationProvider({
  children,
}: RegistrationProviderProps): React.ReactElement {
  const [state, setState] = useState<RegistrationState>(initialState);

  const updateFormData = useCallback((data: Partial<RegistrationFormData>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4) as RegistrationStep,
      error: null,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1) as RegistrationStep,
      error: null,
    }));
  }, []);

  const goToStep = useCallback((step: RegistrationStep) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
      error: null,
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value: RegistrationContextType = {
    ...state,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    setSubmitting,
    setError,
    reset,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

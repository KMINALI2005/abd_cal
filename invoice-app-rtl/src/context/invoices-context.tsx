"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Invoice } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";

// Define the shape of the context
interface InvoicesContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber" | "totalAmount">) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

// Create the context with a default undefined value
const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

// Create the provider component
export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("invoices", []);

  const addInvoice = (invoiceData: Omit<Invoice, "id" | "invoiceNumber" | "totalAmount">) => {
    const totalAmount = invoiceData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newInvoice: Invoice = {
      ...invoiceData,
      id: uuidv4(),
      // Simple invoice number generation, can be improved later
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      totalAmount,
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    const totalAmount = updatedInvoice.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newInvoices = invoices.map((invoice) =>
      invoice.id === updatedInvoice.id ? {...updatedInvoice, totalAmount} : invoice
    );
    setInvoices(newInvoices);
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  return (
    <InvoicesContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, getInvoiceById }}>
      {children}
    </InvoicesContext.Provider>
  );
}

// Create a custom hook for using the context
export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }
  return context;
}

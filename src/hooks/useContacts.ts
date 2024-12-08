import { useState, useEffect } from 'react';
import type { Contact } from '../types';

const STORAGE_KEY = 'emergency-contacts';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (data: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...data,
      id: crypto.randomUUID(),
    };
    setContacts(prev => [...prev, newContact]);
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  return {
    contacts,
    addContact,
    deleteContact,
  };
};
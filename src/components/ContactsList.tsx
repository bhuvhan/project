import React from 'react';
import { Phone, UserRound, Trash2 } from 'lucide-react';
import type { Contact } from '../types';

interface ContactsListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({ contacts, onDelete }) => {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <UserRound className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{contact.name}</h3>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-1" />
                <span>{contact.phone}</span>
              </div>
              <span className="text-sm text-gray-500">{contact.relation}</span>
            </div>
          </div>
          <button
            onClick={() => onDelete(contact.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};
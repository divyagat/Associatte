import { useState } from 'react';

interface EnquiryData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  projectName?: string;
  enquiryType?: string;
  formType?: string;
  source?: string;
  campaign?: string;
  medium?: string;
  city?: string;
  preferredTime?: string;
  [key: string]: any;
}

interface UseEnquiryFormReturn {
  submitEnquiry: (data: EnquiryData) => Promise<any>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  error: string | null;
  resetForm: () => void;
}

export function useEnquiryForm(): UseEnquiryFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEnquiry = async (data: EnquiryData) => {
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }
      
      setSubmitSuccess(true);
      
      // Auto hide success after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
      
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit';
      setError(errorMessage);
      throw err;
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setSubmitSuccess(false);
  };

  return { submitEnquiry, isSubmitting, submitSuccess, error, resetForm };
}
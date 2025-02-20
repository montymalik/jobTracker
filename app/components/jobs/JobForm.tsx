import { JobApplication } from "@/app/lib/types";
import { useState, useEffect } from "react";

interface JobFormProps {
  job?: JobApplication;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

export function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Controlled state for both checkboxes
  const [confirmationChecked, setConfirmationChecked] = useState(job?.confirmationReceived || false);
  const [rejectionChecked, setRejectionChecked] = useState(job?.rejectionReceived || false);

  // Update checkbox states if the job prop changes
  useEffect(() => {
    setConfirmationChecked(job?.confirmationReceived || false);
    setRejectionChecked(job?.rejectionReceived || false);
  }, [job]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Log the form data for debugging
      console.log("Form Data to Submit:", Object.fromEntries(formData.entries()));

      // Set the status: if rejection is checked, archive the job;
      // otherwise, if no status is set, default to "TO_APPLY"
      if (rejectionChecked) {
        formData.set("status", "ARCHIVED");
      } else if (!formData.get("status")) {
        formData.set("status", "TO_APPLY");
      }

      // Set both checkbox values into the FormData
      formData.set("confirmationReceived", String(confirmationChecked));
      formData.set("rejectionReceived", String(rejectionChecked));

      // Append each file to formData
      files.forEach((file) => {
        formData.append("files", file);
      });

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          defaultValue={job?.companyName}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        />
      </div>

      {/* Job Title */}
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          defaultValue={job?.jobTitle}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        />
      </div>

      {/* Job URL */}
      <div>
        <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700">
          Job URL
        </label>
        <input
          type="url"
          id="jobUrl"
          name="jobUrl"
          defaultValue={job?.jobUrl || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        />
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          defaultValue={job?.jobDescription || ""}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        />
      </div>

      {/* Date Submitted */}
      <div>
        <label htmlFor="dateSubmitted" className="block text-sm font-medium text-gray-700">
          Date Submitted
        </label>
        <input
          type="date"
          id="dateSubmitted"
          name="dateSubmitted"
          defaultValue={job?.dateSubmitted ? formatDate(job.dateSubmitted) : ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        />
      </div>

      {/* Date of Interview */}
      <div>
        <label htmlFor="dateOfInterview" className="block text-sm font-medium text-gray-700">
          Date of Interview
        </label>
        <input
          type="date"
          id="dateOfInterview"
          name="dateOfInterview"
          defaultValue={job?.dateOfInterview ? formatDate(job.dateOfInterview) : ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        />
      </div>

      {/* Confirmation Received Checkbox */}
      <div>
        <label htmlFor="confirmationReceived" className="block text-sm font-medium text-gray-700">
          Confirmation Received
        </label>
        <input
          type="checkbox"
          id="confirmationReceived"
          name="confirmationReceived"
          checked={confirmationChecked}
          onChange={(e) => setConfirmationChecked(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Rejection Received Checkbox */}
      <div>
        <label htmlFor="rejectionReceived" className="block text-sm font-medium text-gray-700">
          Rejection Received
        </label>
        <input
          type="checkbox"
          id="rejectionReceived"
          name="rejectionReceived"
          checked={rejectionChecked}
          onChange={(e) => setRejectionChecked(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Files
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="mt-1 block w-full text-sm text-gray-500"
        />
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {isSubmitting ? "Saving..." : job ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}


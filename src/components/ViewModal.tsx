import { format } from "date-fns";
import { Status } from "@/generated/prisma";

type ApplicationCard = {
  id: string;
  company: string;
  position: string;
  status: Status;
  appliedDate: string;
  notes?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
};

type Props = {
  application: ApplicationCard;
  onClose: () => void;
};

const ViewModal = ({ application, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">Application Details</h2>
        <p>
          <strong>Company:</strong> {application.company}
        </p>
        <p>
          <strong>Position:</strong> {application.position}
        </p>
        <p>
          <strong>Status:</strong> {application.status}
        </p>
        <p>
          <strong>Applied Date:</strong>{" "}
          {format(new Date(application.appliedDate), "MMM d, yyyy")}
        </p>

        {application.notes && (
          <p>
            <strong>Notes:</strong> {application.notes}
          </p>
        )}
        {application.contactName && (
          <p>
            <strong>Contact Name:</strong> {application.contactName}
          </p>
        )}
        {application.contactPhone && (
          <p>
            <strong>Contact Phone:</strong> {application.contactPhone}
          </p>
        )}
        {application.contactEmail && (
          <p>
            <strong>Contact Email:</strong> {application.contactEmail}
          </p>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ViewModal;

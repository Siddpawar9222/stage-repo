import React from "react";
import { useSelector } from "react-redux";
import { MODAL_CONSTANTS } from "../../utils/modalUtils";
import { RootState } from "../../app/store";
import SessionExpiredModal from "./components/SessionExpiredModalBody";
import ErrorModalBody from "./components/ErrorModalBody";
import ConfirmationDeleteModal from "./components/ConfirmationDeleteModal";
import AddOrEditStudent from "../../pages/dms/Student/AddOrEditStudent";
import ViewStudentDetails from "../../pages/dms/Student/ViewStudentDetails";
import { PAYMENT_CONSTANTS } from "../../utils/paymetUtils";
import ClassAdditionalChargeModel from "../../pages/pms/ClassAdditionalChargeModel";
import PasswordWarningModal from "./components/PasswordWarningModal";


// Define the expected structure of the modal state
interface ModalState {
  isOpen: boolean;
  bodyType: string;
  title?: string;
  extraObject?: any;
}

const ModalLayout: React.FC = () => {
  // Using useSelector with proper TypeScript type annotation
  const { isOpen, bodyType, title, extraObject } = useSelector<RootState, ModalState>(
    (state) => state.modal
  );

  return (
    <>
      {
        {
          [MODAL_CONSTANTS.SESSION_EXPIRED]: <SessionExpiredModal isOpen={isOpen} message={title} />,
          [MODAL_CONSTANTS.ERROR]: <ErrorModalBody isOpen={isOpen} message={title} />,
          [MODAL_CONSTANTS.DELETE_CONFIRMATION]: <ConfirmationDeleteModal isOpen={isOpen} extraObject={extraObject} />,
          [MODAL_CONSTANTS.PASSWORD_WARNING]: <PasswordWarningModal isOpen={isOpen} extraObject={extraObject} />,
          [MODAL_CONSTANTS.DEFAULT]: <div></div>
        }[bodyType]
      }
      {
        {
          [MODAL_CONSTANTS.ADD_STUDENT]: <AddOrEditStudent isOpen={isOpen} extraObject={extraObject} />,
          [MODAL_CONSTANTS.EDIT_STUDENT]: <AddOrEditStudent isOpen={isOpen} extraObject={extraObject} />,
          [MODAL_CONSTANTS.VIEW_STUDENT_DETAILS]: <ViewStudentDetails isOpen={isOpen} extraObject={extraObject} />
        }[bodyType]
      }
      {
        {
          [PAYMENT_CONSTANTS.ADD_ADDITIONAL_CHARGE_TO_CLASS_DUE]: <ClassAdditionalChargeModel isOpen={isOpen} extraObject={extraObject} />,
        }[bodyType]
      }
    </>
  );
};

export default ModalLayout;

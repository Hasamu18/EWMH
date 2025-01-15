import {
  POST_REPAIR_BULLET_POINTS,
  PRE_REPAIR_BULLET_POINTS,
} from "@/constants/RepairEvidence";
import { Button, Modal, Text } from "native-base";

export enum ExplainRepairEvidenceModalModes {
  PRE_REPAIR,
  POST_REPAIR,
}
interface ExplainRepairEvidenceModalProps {
  isShown: boolean;
  setIsShown: (value: boolean) => void;
  mode: ExplainRepairEvidenceModalModes;
}
export default function ExplainRepairEvidenceModal({
  isShown,
  setIsShown,
  mode,
}: ExplainRepairEvidenceModalProps) {
  return (
    <>
      <Modal isOpen={isShown} onClose={() => setIsShown(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            {mode == ExplainRepairEvidenceModalModes.PRE_REPAIR
              ? "Hình trước sửa chữa"
              : "Nghiệm thu & Bằng chứng"}
          </Modal.Header>
          <Modal.Body>
            <Text fontSize="md" fontWeight="bold" marginY={1}>
              {mode == ExplainRepairEvidenceModalModes.PRE_REPAIR
                ? "Vui lòng chụp hình khu vực cần sửa chữa trước khi tiến hành sửa chữa. Điều này sẽ giúp:"
                : "Việc chụp nghiệm thu và bằng chứng sửa chữa hoàn thành sẽ giúp:"}
            </Text>
            {mode == ExplainRepairEvidenceModalModes.PRE_REPAIR ? (
              <>
                {PRE_REPAIR_BULLET_POINTS.map((bulletPoint, key) => {
                  return (
                    <Text fontSize="md" key={key}>
                      {bulletPoint}
                    </Text>
                  );
                })}
              </>
            ) : (
              <>
                {POST_REPAIR_BULLET_POINTS.map((bulletPoint, key) => {
                  return (
                    <Text fontSize="md" key={key}>
                      {bulletPoint}
                    </Text>
                  );
                })}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                setIsShown(false);
              }}
            >
              Đóng
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

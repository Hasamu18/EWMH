import { RequestDetails, RequestDetailsWorker } from "@/models/RequestDetails";
import { DecodeToken, GetAccessToken } from "./TokenUtils";

export async function IsLeadWorker(
  requestDetail: RequestDetails
): Promise<boolean> {
  const accessToken = await GetAccessToken();
  const decodedToken = await DecodeToken(accessToken);
  const workerId = (decodedToken as any).accountId as string;
  return IsLead(workerId, requestDetail.workers);
}

function IsLead(workerId: string, workers: RequestDetailsWorker[]) {
  const worker = workers.find((worker) => worker.workerId === workerId);
  if (worker?.isLead) return true;
  return false;
}

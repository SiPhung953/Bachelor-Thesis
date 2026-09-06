import { ApplicationStatus } from '../../api-shared/type/ApplicationStatus';

export interface WithdrawApplicationResponse {
    status: ApplicationStatus;
    withdrawnAt: Date;
    message: string;
}
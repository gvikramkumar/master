import { AuthGuard } from '@app/core/guards/auth-guard';
import { AccessManagementComponent } from './access-management.component';

export const ACCESS_MANAGEMENT_ROUTES = [
    {
        path: '',
        component: AccessManagementComponent,
        canActivate: [AuthGuard]
    }
];

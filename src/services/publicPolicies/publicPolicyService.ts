import { apiRequest } from '@/services/api/client'
import type {
  PublicPolicyDeleteResponse,
  PublicPolicyDetail,
  PublicPolicyFormOptions,
  PublicPolicyListResponse,
  PublicPolicyPayload,
} from '@/types/publicPolicy'

export async function fetchPublicPolicies(): Promise<PublicPolicyListResponse> {
  return apiRequest<PublicPolicyListResponse>('/politicas-publicas', {
    requiresAuth: true,
  })
}

export async function fetchPublicPolicyById(
  policyId: number,
): Promise<PublicPolicyDetail> {
  return apiRequest<PublicPolicyDetail>(`/politicas-publicas/${policyId}`, {
    requiresAuth: true,
  })
}

export async function fetchPublicPolicyFormOptions(): Promise<PublicPolicyFormOptions> {
  return apiRequest<PublicPolicyFormOptions>('/politicas-publicas/form-options', {
    requiresAuth: true,
  })
}

export async function createPublicPolicy(
  payload: PublicPolicyPayload,
): Promise<PublicPolicyDetail> {
  return apiRequest<PublicPolicyDetail>('/politicas-publicas', {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify(payload),
  })
}

export async function updatePublicPolicy(
  policyId: number,
  payload: PublicPolicyPayload,
): Promise<PublicPolicyDetail> {
  return apiRequest<PublicPolicyDetail>(`/politicas-publicas/${policyId}`, {
    method: 'PUT',
    requiresAuth: true,
    body: JSON.stringify(payload),
  })
}

export async function deletePublicPolicy(
  policyId: number,
): Promise<PublicPolicyDeleteResponse> {
  return apiRequest<PublicPolicyDeleteResponse>(`/politicas-publicas/${policyId}`, {
    method: 'DELETE',
    requiresAuth: true,
  })
}

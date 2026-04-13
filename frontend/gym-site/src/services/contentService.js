import { getJson, putJson } from './httpClient';

export const contentService = {
  getConfig: () => getJson('/config'),
  updateConfig: (data, token) => putJson('/admin/config', data, { token }),
};

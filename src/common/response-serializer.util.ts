export function buildResponse(success: boolean, data: any, message: string) {
  return { success, data, message };
}

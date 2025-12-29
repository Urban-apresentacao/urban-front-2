import api from "./api";

export async function getAppointments(params) {
  // params: { search, page, limit }
  const { data } = await api.get("/appointments", { params });
  return data;
}

export async function getAppointmentById(id) {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
}

export async function createAppointment(payload) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function updateAppointment(id, payload) {
  const { data } = await api.put(`/appointments/${id}`, payload);
  return data;
}

export async function cancelAppointment(id) {
  const { data } = await api.patch(`/appointments/${id}/cancel`);
  return data;
}
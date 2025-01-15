import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  addApartment,
  AddApartmentParams,
  addRooms,
  AddRoomsParams,
  getAllApartmentPaginated,
  GetAllApartmentPaginatedParams,
  getAllRoomPaginated,
  GetAllRoomPaginatedParams,
  setCurrentApartmentList,
  setCurrentRoomList,
  updateApartment,
  UpdateApartmentParams,
  updateRoom,
  UpdateRoomParams,
} from "../redux/slice/apartmentSlice";

export function useApartment() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.apartment);
  const dispatch = useAppDispatch();

  const handleGetAllApartmentsPaginated = useCallback(
    async (value: GetAllApartmentPaginatedParams) => {
      const resultAction = await dispatch(getAllApartmentPaginated(value));
      if (getAllApartmentPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentApartmentList({
            apartments: resultAction.payload[0],
            total: resultAction.payload[1],
          }),
        );
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleAddRooms = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: AddRoomsParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(addRooms(values));
      if (addRooms.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Thêm căn hộ thành công",
          placement: "topRight",
        });
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleUpdateRoom = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: UpdateRoomParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(updateRoom(values));
      if (updateRoom.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Cập nhật căn hộ thành công",
          placement: "topRight",
        });
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleGetAllRoomsPaginated = useCallback(
    async (value: GetAllRoomPaginatedParams) => {
      const resultAction = await dispatch(getAllRoomPaginated(value));
      if (getAllRoomPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentRoomList({
            rooms: resultAction.payload[0],
            total: resultAction.payload[1],
          }),
        );
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleAddApartment = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: AddApartmentParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(addApartment(values));
      if (addApartment.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Tạo mới chung cư thành công",
          placement: "topRight",
        });
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleUpdateApartment = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: UpdateApartmentParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(updateApartment(values));
      if (updateApartment.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Cập nhật chung cư thành công",
          placement: "topRight",
        });
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  return {
    state,
    handleGetAllApartmentsPaginated,
    handleAddApartment,
    handleUpdateApartment,
    handleGetAllRoomsPaginated,
    handleAddRooms,
    handleUpdateRoom,
  };
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authAPI, endpoints } from '../../configs/APIs';
import { useUser } from '../../store/contexts/UserContext';
import { UPDATE_USER } from '../../store/reducers/UserReducer';
import { roles, statusCode } from '../../utils/Constatns';
import Home from '../home/Home';
import ProfileCustomer from './ProfileCustomer';
import ProfileShipper from './ProfileShipper';
import ProfileSupplier from './ProfileSupplier';
import { routeUrl } from '../../App';

const Profile = () => {
   const [user, dispatch] = useUser();
   const [profile, setProfile] = useState(user?.profile);

   const navigate = useNavigate();

   const processUpdateProfile = (field, value) => {
      setProfile({ ...profile, [field]: value });
   };

   const handleUpdateProfile = async (e) => {
      e.preventDefault();

      const Toast = Swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timer: 3000,
         timerProgressBar: true,
         didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
         },
      });

      Swal.fire({
         title: 'Đang cập nhật...',
         text: 'Vui lòng đợi một chút.',
         allowOutsideClick: false,
         showConfirmButton: false,
         didOpen: () => {
            Swal.showLoading();
         },
      });

      const formData = new FormData();
      if (profile?.lastName !== user?.profile?.lastName) {
         formData.append('lastName', profile?.lastName);
      }
      if (profile?.middleName !== user?.profile?.middleName) {
         formData.append('middleName', profile?.middleName);
      }
      if (profile?.firstName !== user?.profile?.firstName) {
         formData.append('firstName', profile?.firstName);
      }
      if (profile?.phone !== user?.profile?.phone) {
         formData.append('phone', profile?.phone);
      }
      if (profile?.address !== user?.profile?.address) {
         formData.append('address', profile?.address);
      }
      if (profile?.gender !== user?.profile?.gender) {
         formData.append('gender', profile?.gender);
      }
      if (profile?.dateOfBirth !== user?.profile?.dateOfBirth) {
         formData.append('dateOfBirth', profile?.dateOfBirth);
      }
      if (profile?.name !== user?.profile?.name) {
         formData.append('name', profile?.name);
      }
      if (profile?.contactInfo !== user?.profile?.contactInfo) {
         formData.append('contactInfo', profile?.contactInfo);
      }

      try {
         let res = null;
         switch (user?.data?.role) {
            case roles.CUSTOMER:
               res = await authAPI().post(endpoints.updateProfileCustomer, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
               });
               break;
            case roles.SUPPLIER:
               res = await authAPI().post(endpoints.updateProfileSupplier, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
               });
               break;
            case roles.DISTRIBUTOR:
               navigate(routeUrl.HOME);
               break;
            case roles.MANUFACTURER:
               navigate(routeUrl.HOME);
               break;
            case roles.SHIPPER:
               res = await authAPI().post(endpoints.updateProfileShipper, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
               });
               break;
            default:
               navigate(routeUrl.HOME);
               break;
         }

         if (res.status === statusCode.HTTP_200_OK) {
            dispatch({
               type: UPDATE_USER,
               payload: {
                  data: user?.data,
                  profile: res.data,
               },
            });
            Toast.fire({
               icon: 'success',
               title: 'Cập nhật thành công',
               text: 'Hồ sơ của bạn đã được cập nhật.',
            });
         }
      } catch (error) {
         Swal.showValidationMessage(
            `Cập nhật thất bại: ${
               error?.response?.data.map((data) => data.message).join('\n') || 'Hệ thống đang bận, vui lòng thử lại sau'
            }`,
         );
         console.error(error);
         console.error(error?.response);
      }
   };

   switch (user?.data?.role) {
      case roles.CUSTOMER:
         return (
            <ProfileCustomer profile={profile} processFunc={processUpdateProfile} updateFunc={handleUpdateProfile} />
         );
      case roles.SUPPLIER:
         return (
            <ProfileSupplier profile={profile} processFunc={processUpdateProfile} updateFunc={handleUpdateProfile} />
         );
      case roles.DISTRIBUTOR:
         return <Home />;
      case roles.MANUFACTURER:
         return <Home />;
      case roles.SHIPPER:
         return (
            <ProfileShipper profile={profile} processFunc={processUpdateProfile} updateFunc={handleUpdateProfile} />
         );
      default:
         return <Home />;
   }
};

export default Profile;

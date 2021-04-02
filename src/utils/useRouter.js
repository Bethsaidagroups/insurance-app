/* eslint-disable */

import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router'

// Wrap and export
const useRouter = (Component) => (props) =>{
    const navigate = useNavigate();
    const params = useParams();
    return (<Component {...props} navigate={navigate} params={params} />);
}

export default useRouter
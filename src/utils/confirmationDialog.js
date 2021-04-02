/* eslint-disable */
/**
 * Confirmation Dialog Provider
 * It provides to react prop a connecting function for all views to display confirmation
 */
import React, {useState} from 'react';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import { isFunction } from 'underscore';

 const withConfirmationDialog = component =>{
     const ConfirmationDialogWrapper = props =>{

        const [viewCtrl, setViewCtrl] = useState("")
        const [dialogTitle, setDialogTitle] = useState("")
        const [dialogDescription, setDialogDescription] = useState("")
        const [dialogConfirm, setDialogConfirm] = useState(null)
        const [dialogClose, setDialogClose] = useState(null)

        const openDialog = ({viewCtrl="",title="",description="",confirm=null,close=null}) =>{
            setViewCtrl(viewCtrl)
            setDialogTitle(title)
            setDialogDescription(description)
            setDialogClose(()=>(dialog)=>{
                if(close){
                    close(dialog)
                }
                else{
                    closeLocal()
                }
            })
            setDialogConfirm(()=>(dialog)=>{
                if(confirm){
                    setViewCtrl("loading");
                    confirm(dialog)
                }
            })
        }

        const closeLocal = ()=>{
            setViewCtrl("");
        }

        const close = ()=>{
            if(isFunction(dialogClose)){
                dialogClose({viewCtrl:viewCtrl, close:closeLocal})
            }
            else{
                setViewCtrl("");
            }
        }

        const confirm = ()=>{
            if(isFunction(dialogConfirm)){
                dialogConfirm({
                    setViewCtrl:setViewCtrl, 
                    setTitle:setDialogTitle, 
                    setDescription:setDialogDescription,
                    close:closeLocal
                })
            } 
        }

        const Component = component

         return(
            <React.Fragment>
                <ConfirmationDialog
                    viewCtrl={viewCtrl}
                    title={dialogTitle}
                    description={dialogDescription}
                    onConfirm={confirm}
                    onClose={close}
                />
                <Component openDialog={openDialog} {...props} />
            </React.Fragment>
         )
     }

    return ConfirmationDialogWrapper
 }
 
 export default withConfirmationDialog;

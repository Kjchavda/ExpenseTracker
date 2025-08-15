import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview';
import Modal from '../../components/Modal';
import axios from "../../api/axios";
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import { DeleteAlert } from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

function Income() {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  //get all income details

  const fetchIncomeData = async () => {
    if(loading) return;
    setLoading(true);
    
    try{
      const token = localStorage.getItem('token');

      const response = await axios.get("/income", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIncomeData(response.data);
  } catch(error){
    console.error("Something went wrong, please try again later", error);
  } finally{
    setLoading(false);
  }
}

  const handleAddIncome = async (income) => {
    const token = localStorage.getItem('token');
    const { source, amount, date, icon } = income;
    const description = "";
    //Validation checks

    if(!source.trim()){
      toast.error("Source is required");
      return;
    }
    if(!amount || isNaN(amount) || amount<=0){
      toast.error("Amount is invalid");
      return;
    }
    // if(!date){
    //   toast.error("Date is required");
    //   return;
    // }
    try{
      await axios.post("/income/add",{
        amount,
        source,
        ...(description && { description }), 
        ...(date && { date })
      } ,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setOpenAddIncomeModal(false);
    toast.success("Income added succesfully");
    fetchIncomeData();

  }catch(error){
    console.error("Error adding income: ", error.response?.data?.message || error.message);
    
  }
};

  const deleteIncome = async (id) => {
    const token = localStorage.getItem('token');

    try{
      await axios.delete(`/income/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOpenDeleteAlert({show: false, data: null});
      toast.success("Income deleted succesfully");
      fetchIncomeData();
    } catch(error){
      console.error("Error deleting income: ", error.response?.data?.message || error.message);
      
    }
  };

  //add download income details here
  const handleDownloadIncomeDetails = () => {};

  useEffect(() => {
    fetchIncomeData()
  
    return () => {}
  }, [])
  

  return (
    <DashboardLayout activeMenu={"Income"}>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />

          </div>

          <IncomeList 
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={()=>setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={()=>setOpenDeleteAlert({show: false, data: null})}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />

        </Modal>


      </div>
    </DashboardLayout>
  )
}

export default Income
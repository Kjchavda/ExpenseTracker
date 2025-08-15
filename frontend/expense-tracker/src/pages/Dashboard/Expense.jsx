import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import toast from 'react-hot-toast';
import axios from '../../api/axios'
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import { DeleteAlert } from '../../components/DeleteAlert';

function Expense() {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  //get all expense details

  const fetchExpenseData = async () => {
    if(loading) return;
    setLoading(true);
    
    try{
      const token = localStorage.getItem('token');

      const response = await axios.get("/expense", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpenseData(response.data);
  } catch(error){
    console.error("Something went wrong, please try again later", error);
  } finally{
    setLoading(false);
  }
}

  const handleAddExpense = async (expense) => {
    const token = localStorage.getItem('token');
    const { category, amount, date, icon } = expense;
    const description = "";
    //Validation checks

    if(!category.trim()){
      toast.error("Category is required");
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
      await axios.post("/expense/add",{
        amount,
        category,
        ...(description && { description }), 
        ...(date && { date })
      } ,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setOpenAddExpenseModal(false);
    toast.success("Expense added succesfully");
    fetchExpenseData();

  }catch(error){
    console.error("Error adding expense: ", error.response?.data?.message || error.message);
    
  }
};

const deleteExpense = async (id) => {
    const token = localStorage.getItem('token');

    try{
      await axios.delete(`/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOpenDeleteAlert({show: false, data: null});
      toast.success("Expense deleted succesfully");
      fetchExpenseData();
    } catch(error){
      console.error("Error deleting Expense: ", error.response?.data?.message || error.message);
      
    }
  };

  //add download expense details here
  const handleDownloadExpenseDetails = () => {};

  useEffect(() => {
    fetchExpenseData();
  
    return () => {
      
    }
  }, [])
  


  return (
    <DashboardLayout activeMenu={"Expense"}>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6 '>
          <div className=''>
            <ExpenseOverview 
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList 
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({show: true, data:id})}
            onDownload= {handleDownloadExpenseDetails}
          />

        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClose={()=>setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={()=>setOpenDeleteAlert({show: false, data: null})}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />

        </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Expense
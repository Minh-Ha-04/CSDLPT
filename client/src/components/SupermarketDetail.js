import React, { useState, useEffect, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid,
  IconButton,
  TableFooter
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SupermarketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supermarket, setSupermarket] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerBirthday, setCustomerBirthday] = useState('');
  const [products, setProducts] = useState([
    { product_id: '', product_name: '',unit: 1, price: 0 }
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch supermarket details
        const supermarketResponse = await axios.get(`http://localhost:5000/api/supermarkets/${id}`);
        if (!supermarketResponse.data) {
          throw new Error('Không nhận được dữ liệu siêu thị từ server');
        }
        setSupermarket(supermarketResponse.data);

        // Fetch employees
        const employeesResponse = await axios.get(`http://localhost:5000/api/employees/supermarket/${id}`);
        if (employeesResponse.data) {
          setEmployees(employeesResponse.data);
        }

        // Fetch products
        const productsResponse = await axios.get(`http://localhost:5000/api/products/supermarket/${id}`);
        if (productsResponse.data) {
          setAvailableProducts(productsResponse.data);
        }

        // Fetch customers
        const customersResponse = await axios.get('http://localhost:5000/api/customers');
        if (customersResponse.data) {
          setCustomers(customersResponse.data);
        }

        // Fetch invoices
        const invoicesResponse = await axios.get(`http://localhost:5000/api/invoices/supermarket/${id}`);
        if (invoicesResponse.data) {
          setInvoices(invoicesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Tính tổng tiền khi sản phẩm thay đổi
  useEffect(() => {
    const total = products.reduce((sum, product) => {
      return sum + (product.unit * product.price);
    }, 0);
    setTotalAmount(total);
  }, [products]);

  const handleBack = () => {
    navigate('/');
  };

  const handleAddProduct = () => {
    setProducts([...products, { product_id: '', product_name: '',unit: 1, price: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    
    // Nếu thay đổi sản phẩm, cập nhật thông tin từ sản phẩm được chọn
    if (field === 'product_id' && value) {
      const selectedProduct = availableProducts.find(p => p.product_id === value);
      if (selectedProduct) {
        newProducts[index].product_name = selectedProduct.product_name;
        newProducts[index].price = selectedProduct.price;
      }
    }
    
    setProducts(newProducts);
  };

  const handleEmployeeChange = (event) => {
    const selectedEmployee = employees.find(e => e.employee_id === event.target.value);
    if (selectedEmployee) {
      setSelectedEmployee(selectedEmployee.employee_id);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      if (!selectedEmployee) {
        setError('Vui lòng chọn nhân viên');
        return;
      }

      if (!customerName || !customerPhone || !customerBirthday) {
        setError('Vui lòng nhập đầy đủ thông tin khách hàng');
        return;
      }

      if (products.length === 0 || (products.length === 1 && !products[0].product_id)) {
        setError('Vui lòng chọn ít nhất một sản phẩm');
        return;
      }

      // Tạo khách hàng mới
      const customerData = {
        customer_id: `KH${Date.now()}`,
        customer_name: customerName,
        phone: customerPhone,
        birthday: customerBirthday
      };

      // Tạo hóa đơn mới
      const invoiceData = {
        invoice_id: `PX${Date.now()}`,
        supermarket_id: id,
        employee_id: selectedEmployee,
        customer_id: `KH${Date.now()}`,
        customer_name: customerName,
        phone: customerPhone,
        date_sale: new Date().toISOString(),
        product_list: products.map(product => ({
          product_id: product.product_id,
          product_name: product.product_name,
          unit: product.unit,
          price: product.price
        })),
        payment: totalAmount
      };

      // Gửi dữ liệu lên server
      const [customerResponse, invoiceResponse] = await Promise.all([
        axios.post('http://localhost:5000/api/customers', customerData),
        axios.post('http://localhost:5000/api/invoices', invoiceData)
      ]);

      if (customerResponse.data && invoiceResponse.data) {
        alert('Tạo hóa đơn thành công!');
        setSelectedEmployee('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerBirthday('');
        setProducts([{ product_id: '', product_name: '',unit: 1, price: 0 }]);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      setError(error.message || 'Không thể tạo hóa đơn. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`);
        // Cập nhật lại danh sách hóa đơn sau khi xóa
        const updatedInvoices = invoices.filter(invoice => invoice.invoice_id !== invoiceId);
        setInvoices(updatedInvoices);
        alert('Xóa hóa đơn thành công!');
      } catch (error) {
        console.error('Error deleting invoice:', error);
        setError(error.message || 'Không thể xóa hóa đơn. Vui lòng thử lại sau.');
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Quay lại danh sách
      </Button>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          Tạo hóa đơn mới - {supermarket.name}
        </Typography>

        <Box sx={{ width: '100%', mb: 4 }}>
          <FormControl fullWidth size="large">
            <InputLabel>Chọn nhân viên</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              label="Chọn nhân viên"
              sx={{ 
                fontSize: '1.1rem',
                '& .MuiSelect-select': {
                  padding: '16px 14px'
                }
              }}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.employee_id} value={employee.employee_id} sx={{ fontSize: '1.1rem', padding: '12px 14px' }}>
                  {employee.name} - {employee.position}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={4}>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              size="large"
              label="Tên khách hàng"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              sx={{ 
                fontSize: '1.1rem',
                '& .MuiInputBase-input': {
                  padding: '16px 14px'
                }
              }}
            />
          </Grid>

          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              size="large"
              label="Số điện thoại"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              sx={{ 
                fontSize: '1.1rem',
                '& .MuiInputBase-input': {
                  padding: '16px 14px'
                }
              }}
            />
          </Grid>

          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              size="large"
              label="Ngày sinh"
              value={customerBirthday}
              onChange={(e) => setCustomerBirthday(e.target.value)}
              placeholder="DD/MM/YYYY"
              sx={{ 
                fontSize: '1.1rem',
                '& .MuiInputBase-input': {
                  padding: '16px 14px'
                }
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Danh sách sản phẩm
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã sản phẩm</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Đơn giá</TableCell>
                  <TableCell>Thành tiền</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={product.product_id}
                          onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Chọn sản phẩm</em>
                          </MenuItem>
                          {availableProducts.map((p) => (
                            <MenuItem key={p.product_id} value={p.product_id}>
                              {p.product_id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={product.product_name}
                          onChange={(e) => {
                            const selectedProduct = availableProducts.find(p => p.product_name === e.target.value);
                            if (selectedProduct) {
                              handleProductChange(index, 'product_id', selectedProduct.product_id);
                              handleProductChange(index, 'product_name', selectedProduct.product_name);
                              handleProductChange(index, 'price', selectedProduct.price);
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>Chọn sản phẩm</em>
                          </MenuItem>
                          {availableProducts.map((p) => (
                            <MenuItem key={p.product_id} value={p.product_name}>
                              {p.product_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={product.unit}
                        onChange={(e) => handleProductChange(index, 'unit', parseInt(e.target.value) || 0)}
                        size="small"
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={product.price}
                        size="small"
                        fullWidth
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {(product.unit * product.price).toLocaleString('vi-VN')} đ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveProduct(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="h6">Tổng tiền:</Typography>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <Typography variant="h6" color="primary">
                      {totalAmount.toLocaleString('vi-VN')} đ
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            sx={{ mt: 2 }}
          >
            Thêm sản phẩm
          </Button>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateInvoice}
          >
            Tạo hóa đơn
          </Button>
        </Box>
      </Paper>

      {/* Invoices List */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          Danh sách hóa đơn
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã hóa đơn</TableCell>
                <TableCell>Ngày bán</TableCell>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice_id}>
                  <TableCell>{invoice.invoice_id}</TableCell>
                  <TableCell>{new Date(invoice.date_sale).toLocaleDateString('vi-VN')}</TableCell>
                  <products_list>
                    {employees.find(emp => emp.employee_id === invoice.employee_id)?.name || invoice.employee_id}
                  </products_list>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{invoice.phone}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {invoice.payment.toLocaleString('vi-VN')} 
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleDeleteInvoice(invoice.invoice_id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default SupermarketDetail; 
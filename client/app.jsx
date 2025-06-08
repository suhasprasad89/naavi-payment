const { useState, useEffect } = React;

function App() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    parentName: '',
    studentName: '',
    studentId: '',
    amount: ''
  });

  const fetchPayments = async () => {
    const res = await fetch('/api/payments');
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ parentName: '', studentName: '', studentId: '', amount: '' });
    fetchPayments();
  };

  return (
    <div className="container">
      <h1>Student Payment System</h1>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Parent Name</label>
          <input name="parentName" value={form.parentName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Student Name</label>
          <input name="studentName" value={form.studentName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Student ID</label>
          <input name="studentId" value={form.studentId} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
        </div>
        <button type="submit">Pay</button>
      </form>
      <h2>Payments</h2>
      <table id="paymentsTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Parent</th>
            <th>Student</th>
            <th>Student ID</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.parentName}</td>
              <td>{p.studentName}</td>
              <td>{p.studentId}</td>
              <td>{p.amount}</td>
              <td>{new Date(p.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

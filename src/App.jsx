import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, GraduationCap, BookOpen, Building2, Users,
  Search, Bell, Plus, Menu, ChevronDown, RefreshCw, X,
  Pencil, Trash2, Wifi, WifiOff, ArrowUpRight, CircleHelp
} from "lucide-react";
import api from "./api";
import "./App.css";

const resourceConfig = {
  Students: {
    path: "/api/students",
    title: "Students",
    singular: "Student",
    icon: GraduationCap,
    fields: [
      { name: "fullName", label: "Full name", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "rollNumber", label: "Roll number" },
      { name: "department", label: "Department" },
      { name: "year", label: "Year" },
      { name: "status", label: "Status" }
    ]
  },
  Courses: {
    path: "/api/courses",
    title: "Courses",
    singular: "Course",
    icon: BookOpen,
    fields: [
      { name: "name", label: "Course name", required: true },
      { name: "code", label: "Course code" },
      { name: "credits", label: "Credits", type: "number" },
      { name: "department", label: "Department" }
    ]
  },
  Departments: {
    path: "/api/departments",
    title: "Departments",
    singular: "Department",
    icon: Building2,
    fields: [
      { name: "name", label: "Department name", required: true },
      { name: "code", label: "Department code" },
      { name: "head", label: "Department head" }
    ]
  }
};

// Demo rows are used only when the backend endpoints cannot be reached.
// They are not written to MySQL.
const demoData = {
  Students: [
    { id: 1, rollNumber: "CS2026001", fullName: "Rahul Sharma", email: "rahul@example.com", department: "Computer Science", status: "Active", year: "3" },
    { id: 2, rollNumber: "EC2026002", fullName: "Priya Reddy", email: "priya@example.com", department: "Electronics", status: "Active", year: "2" },
    { id: 3, rollNumber: "ME2026003", fullName: "Arjun Kumar", email: "arjun@example.com", department: "Mechanical", status: "Inactive", year: "1" },
    { id: 4, rollNumber: "CS2026004", fullName: "Sneha Patel", email: "sneha@example.com", department: "Computer Science", status: "Active", year: "4" }
  ],
  Courses: [
    { id: 1, name: "Data Structures and Algorithms", code: "CS201", credits: 4, department: "Computer Science" },
    { id: 2, name: "Database Management Systems", code: "CS305", credits: 3, department: "Computer Science" },
    { id: 3, name: "Computer Networks", code: "CS401", credits: 3, department: "Computer Science" }
  ],
  Departments: [
    { id: 1, name: "Computer Science", code: "CSE", head: "Dr. A. Kumar" },
    { id: 2, name: "Electronics", code: "ECE", head: "Dr. S. Rao" },
    { id: 3, name: "Mechanical", code: "ME", head: "Dr. P. Reddy" }
  ]
};

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Students", icon: GraduationCap },
  { name: "Courses", icon: BookOpen },
  { name: "Departments", icon: Building2 }
];

function getRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.content)) return payload.content;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return null;
}

function getRecordName(record) {
  return record.fullName || record.name || record.title || record.rollNumber || record.code || `Record ${record.id ?? ""}`;
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [rowsByType, setRowsByType] = useState(demoData);
  const [sourceByType, setSourceByType] = useState({ Students: "demo", Courses: "demo", Departments: "demo" });
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadResource = async (type, quiet = false) => {
    const config = resourceConfig[type];
    if (!config) return;
    if (!quiet) setLoading(true);
    try {
      const response = await api.get(config.path);
      const rows = getRows(response.data);
      if (rows === null) {
        setSourceByType(prev => ({ ...prev, [type]: "unmatched" }));
        setApiMessage(`Connected to ${config.path}, but its response is not a list. Check your controller response format.`);
      } else {
        setRowsByType(prev => ({ ...prev, [type]: rows }));
        setSourceByType(prev => ({ ...prev, [type]: "live" }));
        setApiMessage("");
      }
    } catch {
      setSourceByType(prev => ({ ...prev, [type]: "demo" }));
      setApiMessage(`Could not load ${type.toLowerCase()} from ${config.path}. Showing sample data. Confirm the controller URL and CORS settings to connect your backend.`);
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    loadResource("Students", true);
    loadResource("Courses", true);
    loadResource("Departments", true);
  }, []);

  const activeRows = activePage === "Dashboard" ? rowsByType.Students : (rowsByType[activePage] || []);
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeRows;
    return activeRows.filter(row => Object.values(row).some(value => String(value ?? "").toLowerCase().includes(q)));
  }, [activeRows, search]);

  const liveCount = Object.values(sourceByType).filter(value => value === "live").length;
  const isLive = sourceByType[activePage] === "live";

  const openCreate = () => {
    const config = resourceConfig[activePage];
    if (!config) return;
    setFormValues({});
    setModal({ mode: "create", type: activePage });
  };

  const openEdit = (type, record) => {
    setFormValues({ ...record });
    setModal({ mode: "edit", type, record });
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    if (!modal) return;
    const { type, mode, record } = modal;
    const config = resourceConfig[type];
    const live = sourceByType[type] === "live";
    if (!live) {
      setApiMessage(`The ${type.toLowerCase()} API is not connected. Sample data is read-only; configure the endpoint before saving.`);
      setModal(null);
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await api.post(config.path, formValues);
      } else {
        const id = record.id ?? record.studentId ?? record.courseId ?? record.departmentId;
        if (id === undefined || id === null) throw new Error("This record has no recognized ID field. Check the entity/controller.");
        await api.put(`${config.path}/${id}`, formValues);
      }
      setModal(null);
      await loadResource(type, true);
      setApiMessage(`${config.singular} ${mode === "create" ? "created" : "updated"} successfully.`);
    } catch (error) {
      setApiMessage(error.response?.data?.message || `Could not save ${config.singular.toLowerCase()}. Check your API routes and request fields.`);
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (type, record) => {
    if (sourceByType[type] !== "live") {
      setApiMessage("Sample data cannot be deleted. Connect the real backend API first.");
      return;
    }
    if (!window.confirm(`Delete ${getRecordName(record)}?`)) return;
    const config = resourceConfig[type];
    const id = record.id ?? record.studentId ?? record.courseId ?? record.departmentId;
    if (id === undefined || id === null) {
      setApiMessage("Cannot identify this record. Check the ID field returned by your backend.");
      return;
    }
    try {
      await api.delete(`${config.path}/${id}`);
      await loadResource(type, true);
      setApiMessage(`${config.singular} deleted successfully.`);
    } catch {
      setApiMessage("Delete failed. Confirm that your controller supports DELETE at /{id}.");
    }
  };

  const countFor = type => rowsByType[type]?.length ?? 0;

  return (
    <div className="app-shell">
      {mobileMenuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><GraduationCap size={25} /></div>
          <div><h2>CampusPro</h2><span>Management Portal</span></div>
          <button className="close-menu" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <p className="nav-heading">MAIN MENU</p>
        <nav>
          {menu.map(({ name, icon: Icon }) => (
            <button key={name} className={`nav-item ${activePage === name ? "selected" : ""}`}
              onClick={() => { setActivePage(name); setSearch(""); setMobileMenuOpen(false); }}>
              <Icon size={19} /><span>{name}</span>
              {name !== "Dashboard" && <span className="nav-count">{countFor(name)}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-status">
          <div className={`connection-dot ${liveCount === 3 ? "connected" : ""}`} />
          <div><strong>{liveCount === 3 ? "Backend connected" : "Backend setup"}</strong><span>{liveCount}/3 APIs responding</span></div>
        </div>
        <div className="sidebar-bottom">
          <div className="avatar">HK</div>
          <div className="profile-text"><strong>Administrator</strong><span>College Admin</span></div>
          <ChevronDown size={16} />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="top-title">
            <button className="mobile-menu-button icon-button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <div><span className="eyebrow">COLLEGE MANAGEMENT</span><h1>{activePage}</h1></div>
          </div>
          <div className="top-actions">
            <span className={`backend-pill ${liveCount === 3 ? "online" : ""}`}>
              {liveCount === 3 ? <Wifi size={15} /> : <WifiOff size={15} />}
              {liveCount === 3 ? "Backend online" : "Preview mode"}
            </span>
            <button className="icon-button" aria-label="Refresh data" onClick={() => Object.keys(resourceConfig).forEach(type => loadResource(type, true))}><RefreshCw size={18} /></button>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="avatar top-avatar">HK</div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <span className="welcome-label">ADMINISTRATION PORTAL</span>
            <h2>Welcome back, Administrator <span aria-hidden="true">👋</span></h2>
            <p>Manage your college, students, courses and departments in one place.</p>
            <div className="welcome-actions">
              <button className="welcome-button" onClick={() => { setActivePage("Students"); setSearch(""); }}><Users size={16} /> Manage students <ArrowUpRight size={15} /></button>
              <span className="welcome-note"><span className="mini-dot" /> Academic workspace</span>
            </div>
          </div>
          <div className="welcome-art"><GraduationCap size={86} strokeWidth={1.4} /></div>
          <div className="welcome-orb orb-one" /><div className="welcome-orb orb-two" />
        </section>

        {apiMessage && <div className={`notice ${apiMessage.includes("successfully") ? "notice-success" : ""}`}><CircleHelp size={17} /><span>{apiMessage}</span><button onClick={() => setApiMessage("")} aria-label="Dismiss"><X size={16} /></button></div>}

        {activePage === "Dashboard" ? (
          <>
            <div className="section-heading"><div><h2>Overview</h2><p>Your college at a glance.</p></div><span className="updated-label">Updated just now</span></div>
            <section className="stats-grid">
              <StatCard label="Total Students" value={countFor("Students")} icon={GraduationCap} color="blue" detail={sourceByType.Students === "live" ? "Live database records" : "Preview records"} />
              <StatCard label="Total Courses" value={countFor("Courses")} icon={BookOpen} color="purple" detail={sourceByType.Courses === "live" ? "Live database records" : "Preview records"} />
              <StatCard label="Departments" value={countFor("Departments")} icon={Building2} color="orange" detail={sourceByType.Departments === "live" ? "Live database records" : "Preview records"} />
              <StatCard label="Active Students" value={rowsByType.Students.filter(s => String(s.status || "").toLowerCase() === "active").length} icon={Users} color="green" detail="Based on returned status" />
            </section>
            <div className="section-heading table-section-title"><div><h2>Recent Students</h2><p>{sourceByType.Students === "live" ? "From your Spring Boot API" : "Preview data until the API is connected"}</p></div><button className="text-button" onClick={() => { setActivePage("Students"); setSearch(""); }}>View all students <ArrowUpRight size={15} /></button></div>
            <DataTable rows={rowsByType.Students.slice(0, 5)} type="Students" source={sourceByType.Students} onEdit={openEdit} onDelete={deleteRecord} />
          </>
        ) : (
          <>
            <div className="section-heading resource-heading">
              <div><h2>{activePage} Management</h2><p>View and manage your {activePage.toLowerCase()} records.</p></div>
              <button className="primary-button" onClick={openCreate}><Plus size={17} /> Add {resourceConfig[activePage].singular}</button>
            </div>
            <section className="resource-toolbar">
              <label className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activePage.toLowerCase()}...`} /></label>
              <div className={`source-label ${isLive ? "source-live" : ""}`}>{isLive ? <Wifi size={14} /> : <WifiOff size={14} />}{isLive ? "Live API data" : "Sample preview"}</div>
            </section>
            <DataTable rows={filteredRows} type={activePage} source={sourceByType[activePage]} onEdit={openEdit} onDelete={deleteRecord} />
          </>
        )}

        <footer><span>CampusPro</span> · College Management System <span className="footer-right">Built with React + Spring Boot</span></footer>
      </main>

      {modal && <RecordModal modal={modal} values={formValues} setValues={setFormValues} saving={saving} onClose={() => setModal(null)} onSubmit={saveRecord} />}
      {loading && <div className="loading-indicator"><RefreshCw size={14} className="spin" /> Syncing data…</div>}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, detail }) {
  return <article className="stat-card"><div className={`stat-icon ${color}`}><Icon size={22} /></div><p>{label}</p><h3>{value}</h3><span className="stat-note"><span className="mini-dot" />{detail}</span></article>;
}

function DataTable({ rows, type, source, onEdit, onDelete }) {
  const columns = type === "Students"
    ? [{ key: "rollNumber", label: "STUDENT ID" }, { key: "fullName", label: "STUDENT" }, { key: "department", label: "DEPARTMENT" }, { key: "status", label: "STATUS" }]
    : type === "Courses"
      ? [{ key: "code", label: "COURSE CODE" }, { key: "name", label: "COURSE NAME" }, { key: "credits", label: "CREDITS" }, { key: "department", label: "DEPARTMENT" }]
      : [{ key: "code", label: "DEPT. CODE" }, { key: "name", label: "DEPARTMENT" }, { key: "head", label: "DEPARTMENT HEAD" }];

  return <section className="table-card"><div className="table-scroll"><table><thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}<th>ACTIONS</th></tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.id ?? row.studentId ?? row.courseId ?? row.departmentId ?? index}>
      {columns.map((column, colIndex) => <td key={column.key}>
        {type === "Students" && colIndex === 1 ? <><strong>{row[column.key] || row.name || "Unnamed student"}</strong><span className="email">{row.email || "No email provided"}</span></>
          : column.key === "status" ? <span className={`status ${String(row.status || "Active").toLowerCase()}`}>{row.status || "Active"}</span>
          : (row[column.key] ?? "—")}
      </td>)}
      <td><div className="row-actions"><button title="Edit" aria-label="Edit record" onClick={() => onEdit(type, row)}><Pencil size={15} /></button><button title="Delete" aria-label="Delete record" onClick={() => onDelete(type, row)}><Trash2 size={15} /></button></div></td>
    </tr>)}
    {rows.length === 0 && <tr><td className="empty-cell" colSpan={columns.length + 1}>{source === "live" ? "No records found. Use Add to create one." : "No preview records match your search."}</td></tr>}
    </tbody></table></div></section>;
}

function RecordModal({ modal, values, setValues, saving, onClose, onSubmit }) {
  const config = resourceConfig[modal.type];
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <form className="record-modal" onSubmit={onSubmit}>
      <div className="modal-header"><div><span className="eyebrow">{modal.mode === "create" ? "NEW RECORD" : "EDIT RECORD"}</span><h2>{modal.mode === "create" ? "Add " : "Edit "}{config.singular}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      <p className="modal-description">Enter the details below. Field names should match your Spring Boot entity.</p>
      <div className="form-grid">{config.fields.map(field => <label className="form-field" key={field.name}><span>{field.label}{field.required && " *"}</span><input required={field.required || false} type={field.type || "text"} value={values[field.name] ?? ""} onChange={e => setValues(prev => ({ ...prev, [field.name]: field.type === "number" && e.target.value !== "" ? Number(e.target.value) : e.target.value }))} /></label>)}</div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save record"}</button></div>
    </form>
  </div>;
}

export default App;

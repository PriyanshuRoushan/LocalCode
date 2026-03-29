// pages/AuthPage.jsx
// Combined Sign In / Create Account page.
// Integrates with useAuthStore (login, register, isLoading, error).
// Styled to match the Architect design system (dark gold palette).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import '../styles/global.css';
import '../styles/authPage.css';
import Icon from '../components/Icon';

// ── Sub-components ────────────────────────────────────────────

function AuthField({ id, label, type = 'text', placeholder, value, onChange, name, children }) {
  return (
    <div className="auth-field">
      <div className="auth-field__label-row">
        <label className="auth-field__label" htmlFor={id}>{label}</label>
        {children /* slot for "Forgot password?" link */}
      </div>
      <div className="auth-field__input-wrap">
        <div className="auth-field__beam" aria-hidden="true" />
        <input
          id={id}
          name={name || id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'username'}
          className="auth-field__input"
        />
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }) {
  return (
    <button type="button" className="auth-social-btn" aria-label={`Continue with ${label}`}>
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="auth-error" role="alert">
      {/* inline SVG to avoid extra icon dependency */}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// ── Sign In form ──────────────────────────────────────────────

function SignInForm({ onSuccess }) {
  const [fields, setFields] = useState({ email: '', password: '' });
  const { login, isLoading, error } = useAuthStore();

  const handleChange = (e) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(fields.email, fields.password);
    if (ok) onSuccess();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <ErrorBanner message={error} />

      <AuthField
        id="signin-email"
        name="email"
        label="Email Address"
        type="email"
        placeholder="architect@localcode.io"
        value={fields.email}
        onChange={handleChange}
      />

      <AuthField
        id="signin-password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={fields.password}
        onChange={handleChange}
      >
        <button type="button" className="auth-field__forgot">Forgot Password?</button>
      </AuthField>

      <button
        type="submit"
        className="auth-submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading && <span className="auth-spinner" aria-hidden="true" />}
        {isLoading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}

// ── Sign Up form ──────────────────────────────────────────────

function SignUpForm({ onSuccess }) {
  const [fields, setFields] = useState({ username: '', email: '', password: '', confirm: '' });
  const { register, isLoading, error } = useAuthStore();

  const handleChange = (e) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fields.password !== fields.confirm) {
      useAuthStore.setState({ error: 'Passwords do not match.' });
      return;
    }
    const ok = await register(fields.username, fields.email, fields.password);
    if (ok) onSuccess();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <ErrorBanner message={error} />

      <AuthField
        id="signup-username"
        name="username"
        label="Username"
        placeholder="architect_01"
        value={fields.username}
        onChange={handleChange}
      />

      <AuthField
        id="signup-email"
        name="email"
        label="Email Address"
        type="email"
        placeholder="email@example.com"
        value={fields.email}
        onChange={handleChange}
      />

      <AuthField
        id="signup-password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={fields.password}
        onChange={handleChange}
      />

      <AuthField
        id="signup-confirm"
        name="confirm"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={fields.confirm}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="auth-submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading && <span className="auth-spinner" aria-hidden="true" />}
        {isLoading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}

// ── Main AuthPage ─────────────────────────────────────────────

export default function AuthPage() {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const navigate = useNavigate();

  const handleSuccess = () => navigate('/');

  // Clear errors whenever the user switches tabs
  const switchTab = (next) => {
    useAuthStore.setState({ error: null });
    setTab(next);
  };

  return (
    <div className="auth-root">

      {/* ── Decorative background ── */}
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg__blob auth-bg__blob--tl" />
        <div className="auth-bg__blob auth-bg__blob--br" />
        <div className="auth-bg__dot-grid" />
      </div>

      <main className="auth-main">

        {/* ── Brand ── */}
        <header className="auth-brand">
          <div className="auth-brand__icon-wrap">
            <Icon name="architecture" className="auth-brand__icon" />
          </div>
          <h1 className="auth-brand__title">Architect</h1>
          <p className="auth-brand__sub">LocalCode Workspace</p>
        </header>

        {/* ── Auth card ── */}
        <section className="auth-card" aria-label="Authentication">

          {/* Tab switcher */}
          <div className="auth-tabs" role="tablist" aria-label="Auth mode">
            <button
              role="tab"
              aria-selected={tab === 'signin'}
              className={`auth-tab${tab === 'signin' ? ' auth-tab--active' : ''}`}
              onClick={() => switchTab('signin')}
            >
              Sign In
            </button>
            <button
              role="tab"
              aria-selected={tab === 'signup'}
              className={`auth-tab${tab === 'signup' ? ' auth-tab--active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              Create Account
            </button>
          </div>

          {/* Social login */}
          <div className="auth-social-grid">
            <SocialBtn icon="terminal" label="GitHub" />
            <SocialBtn icon="cloud"    label="Google" />
          </div>

          {/* Divider */}
          <div className="auth-divider" aria-hidden="true">
            <hr className="auth-divider__line" />
            <span className="auth-divider__label">or email</span>
            <hr className="auth-divider__line" />
          </div>

          {/* Forms — rendered conditionally, both mounted so transitions are smooth */}
          {tab === 'signin'
            ? <SignInForm  onSuccess={handleSuccess} />
            : <SignUpForm  onSuccess={handleSuccess} />
          }

        </section>

        {/* ── Footer ── */}
        <footer className="auth-footer">
          <p>
            Need assistance with your environment?
            <a href="#">Documentation</a>
          </p>
        </footer>

        {/* ── Trust badges ── */}
        <div className="auth-trust" aria-hidden="true">
          {[
            { icon: 'lock',        label: 'End-to-End' },
            { icon: 'shield',      label: 'SOC2 Ready' },
            { icon: 'offline_pin', label: 'Offline Core' },
          ].map((item) => (
            <div key={item.icon} className="auth-trust__item">
              <Icon name={item.icon} />
              <span className="auth-trust__label">{item.label}</span>
            </div>
          ))}
        </div>

      </main>

      {/* ── Decorative editor peek (large screens only) ── */}
      <div className="auth-editor-peek" aria-hidden="true">
        <div className="auth-editor-peek__titlebar">
          <div className="auth-editor-peek__dot" style={{ backgroundColor: 'var(--error-container)' }} />
          <div className="auth-editor-peek__dot" style={{ backgroundColor: '#564516' }} />
          <div className="auth-editor-peek__dot" style={{ backgroundColor: 'var(--primary-container)' }} />
        </div>
        <div className="auth-editor-peek__lines">
          <div className="auth-editor-peek__line" style={{ width: '75%' }} />
          <div className="auth-editor-peek__line" style={{ width: '50%' }} />
          <div className="auth-editor-peek__line" style={{ width: '66%' }} />
        </div>
      </div>

    </div>
  );
}
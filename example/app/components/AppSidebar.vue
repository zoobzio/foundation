<template>
  <aside class="app-sidebar">
    <NuxtLink to="/" class="sidebar-brand">
      <span class="sidebar-brand-mark" aria-hidden="true">F</span>
      <span class="sidebar-brand-name">Foundation</span>
    </NuxtLink>

    <nav class="sidebar-nav" aria-label="Primary">
      <NuxtLink to="/" class="sidebar-nav-link">
        <svg
          class="sidebar-nav-icon"
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Dashboard
      </NuxtLink>

      <NuxtLink to="/commissions" class="sidebar-nav-link">
        <svg
          class="sidebar-nav-icon"
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
        Commissions
      </NuxtLink>

      <NuxtLink to="/settings" class="sidebar-nav-link">
        <svg
          class="sidebar-nav-icon"
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 8h10" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M20 16H10" />
          <circle cx="7" cy="16" r="2.5" />
        </svg>
        Settings
      </NuxtLink>
    </nav>

    <div class="sidebar-user">
      <span class="sidebar-user-avatar" aria-hidden="true">AT</span>
      <span class="sidebar-user-meta">
        <span class="sidebar-user-name">Alex Thorwaldson</span>
        <span class="sidebar-user-role">Forgemaster</span>
      </span>
    </div>
  </aside>
</template>

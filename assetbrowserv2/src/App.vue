<template>
  <div :class="['app', { 'light-theme': isLightTheme }]">
    <div class="header">
      <input v-model="search" class="search" placeholder="Search..." />

      <div class="controls">
        <div class="theme-control">
          <span class="theme-label">Theme</span>
          <span class="theme-option" :class="{ active: !isLightTheme }">Dark</span>
          <label class="theme-switch">
            <input type="checkbox" v-model="isLightTheme" />
            <span class="slider"></span>
          </label>
          <span class="theme-option" :class="{ active: isLightTheme }">Light</span>
        </div>

        <button @click="showCustomInput = !showCustomInput" class="custom-id-btn">
          Custom ID
        </button>
      </div>
    </div>

    <div v-if="showCustomInput" class="custom-input-section">
      <input
        v-model="customName"
        @keyup.enter="copyCustomId"
        class="custom-input"
        placeholder="Custom object name..."
      />
      <button @click="copyCustomId" class="copy-btn">Copy ID</button>
      <div v-if="customName" class="custom-result">
        ID: {{ getId(customName) }}
      </div>
    </div>

    <div class="grid">
      <div
        v-for="item in filteredItems"
        :key="item.Hash"
        class="item"
        @click="copyId(item.Name)"
      >
        <img
          :src="getIcon(item.Hash)"
          :alt="item.Name"
          width="64"
          height="64"
          loading="lazy"
          decoding="async"
        />
        <div class="item-content">
          <span class="item-name">{{ item.Name }}</span>
          <small class="id-display">ID: {{ getId(item.Name) }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./items.css"
import * as CRC32 from "crc-32"

const BASE = import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/" ? import.meta.env.BASE_URL : "./"

export default {
  data() {
    return {
      items: [],
      search: "",
      isLightTheme: false,
      showCustomInput: false,
      customName: ""
    }
  },

  computed: {
    filteredItems() {
      const s = this.search.toLowerCase()
      return this.items.filter(i =>
        i.Name.toLowerCase().includes(s)
      )
    }
  },

  methods: {
    getIcon(hash) {
      return `${BASE}snapshots/${hash}.png`
    },

    getId(name) {
      return CRC32.str(name)
    },

    copyId(name) {
      const id = CRC32.str(name)
      navigator.clipboard.writeText(String(id))
      alert(`ID copied: ${id}`)
    },

    copyCustomId() {
      if (!this.customName.trim()) return

      const id = CRC32.str(this.customName.trim())
      navigator.clipboard.writeText(String(id))
      alert(`Custom ID copied: ${id}`)
    }
  },

  mounted() {
    fetch(`${BASE}data.json`)
      .then(r => r.json())
      .then(data => {
        this.items = data
      })
  }
}
</script>

<style>
html, body, #app {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

.app {
  background: #111;
  color: white;
  min-height: 100vh;
  width: 100vw;
  transition: 0.3s;
}

.app.light-theme {
  background: #f5f5f5;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  padding: 16px;
  background: #1f2430;
  border-bottom: 1px solid #2f3545;
}

.app.light-theme .header {
  background: #f3f5f8;
  border-bottom: 1px solid #d6dbe5;
}

.search {
  flex: 1;
  min-width: 220px;
  padding: 10px 14px;
  background: #242a38;
  color: #e7eaef;
  border: 1px solid #3a4153;
  border-radius: 8px;
}

.app.light-theme .search {
  background: white;
  color: #2a3444;
  border: 1px solid #c4c9d5;
}

.controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.theme-control {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #272d3f;
}

.app.light-theme .theme-control {
  background: white;
}

.theme-option {
  font-size: 12px;
  opacity: 0.6;
}

.theme-option.active {
  opacity: 1;
}

.theme-switch {
  position: relative;
  width: 50px;
  height: 24px;
}

.theme-switch input {
  opacity: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background: #ccc;
  border-radius: 24px;
}

input:checked + .slider {
  background: #5c68ff;
}

.custom-id-btn {
  padding: 10px 16px;
  background: #5c68ff;
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-input-section {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #1f2835;
}

.app.light-theme .custom-input-section {
  background: #f7f8fb;
}

.custom-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #3a4153;
  background: #252d3f;
  color: white;
}

.app.light-theme .custom-input {
  background: white;
  color: #2a3444;
}

.copy-btn {
  padding: 10px 16px;
  background: #4caf50;
  border: none;
  border-radius: 8px;
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 16px;
}

.item {
  max-width: 160px;
  aspect-ratio: 1;
  background: #222;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.app.light-theme .item {
  background: white;
}

.item img {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.item-name {
  font-size: 11px;
  text-align: center;
}

.id-display {
  font-size: 9px;
  opacity: 0.7;
}
</style>
(function (global) {
  function uid(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizePrice(value) {
    const price = Number(value);
    return Number.isFinite(price) ? Number(price.toFixed(1)) : 0;
  }

  function normalizeQuantity(value) {
    const quantity = parseInt(value, 10);
    if (!Number.isFinite(quantity) || quantity < 1) return 1;
    return Math.min(quantity, 99);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createItem(payload) {
    return {
      id: payload.id || uid(payload.kind || 'cart'),
      dedupeKey: payload.dedupeKey || payload.id || null,
      kind: payload.kind || 'product',
      source: payload.source || 'unknown',
      title: payload.title || '拼豆商品',
      subtitle: payload.subtitle || '',
      price: normalizePrice(payload.price),
      quantity: normalizeQuantity(payload.quantity),
      selected: payload.selected !== false,
      thumbText: payload.thumbText || '🧩',
      thumbStyle: payload.thumbStyle || '',
      thumbDataUrl: payload.thumbDataUrl || '',
      metadata: payload.metadata || {},
      materialSummary: payload.materialSummary || '',
      materials: Array.isArray(payload.materials) ? payload.materials : []
    };
  }

  let items = [];
  const listeners = new Set();

  function emit() {
    const snapshot = clone(items);
    listeners.forEach((listener) => listener(snapshot));
  }

  function findIndex(itemId) {
    return items.findIndex((item) => item.id === itemId);
  }

  const api = {
    init(seedItems) {
      items = Array.isArray(seedItems) ? seedItems.map(createItem) : [];
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(clone(items));
      return function unsubscribe() {
        listeners.delete(listener);
      };
    },
    getItems() {
      return clone(items);
    },
    addItem(payload) {
      const item = createItem(payload);
      const dedupeKey = item.dedupeKey;
      if (dedupeKey) {
        const existing = items.find((entry) => entry.dedupeKey === dedupeKey);
        if (existing) {
          existing.quantity = Math.min(99, existing.quantity + item.quantity);
          existing.selected = true;
          emit();
          return clone(existing);
        }
      }
      items.push(item);
      emit();
      return clone(item);
    },
    updateItem(itemId, patch) {
      const index = findIndex(itemId);
      if (index < 0) return null;
      items[index] = createItem({ ...items[index], ...patch, id: items[index].id, dedupeKey: items[index].dedupeKey });
      emit();
      return clone(items[index]);
    },
    removeItem(itemId) {
      const index = findIndex(itemId);
      if (index < 0) return;
      items.splice(index, 1);
      emit();
    },
    removeSelected() {
      items = items.filter((item) => !item.selected);
      emit();
    },
    toggleItemSelected(itemId) {
      const index = findIndex(itemId);
      if (index < 0) return;
      items[index].selected = !items[index].selected;
      emit();
    },
    setItemSelected(itemId, selected) {
      const index = findIndex(itemId);
      if (index < 0) return;
      items[index].selected = !!selected;
      emit();
    },
    setAllSelected(selected) {
      items = items.map((item) => ({ ...item, selected: !!selected }));
      emit();
    },
    setQuantity(itemId, quantity) {
      const index = findIndex(itemId);
      if (index < 0) return;
      items[index].quantity = normalizeQuantity(quantity);
      emit();
    },
    getSummary() {
      const badgeCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const selectedCount = items.reduce((sum, item) => sum + (item.selected ? item.quantity : 0), 0);
      const total = items.reduce((sum, item) => sum + (item.selected ? item.price * item.quantity : 0), 0);
      return {
        itemCount: items.length,
        badgeCount,
        selectedCount,
        total: Number(total.toFixed(1)),
        isAllSelected: items.length > 0 && items.every((item) => item.selected)
      };
    }
  };

  global.GodDouCartStore = api;
})(window);

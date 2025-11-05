export const initQuantityStepper = () => {
  const qtyInput = document.getElementById('purchase-qty') as HTMLInputElement | null;
  const btnDec = document.getElementById('qty-dec');
  const btnInc = document.getElementById('qty-inc');
  if (!qtyInput || !btnDec || !btnInc) return;
  const clamp = (value: number) => Math.max(1, Math.min(99, value));
  btnDec.addEventListener('click', () => {
    qtyInput.value = String(clamp(parseInt(qtyInput.value || '1', 10) - 1));
  });
  btnInc.addEventListener('click', () => {
    qtyInput.value = String(clamp(parseInt(qtyInput.value || '1', 10) + 1));
  });
};

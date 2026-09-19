(() => {
  'use strict';

  function getActivePageName() {
    const nav = document.querySelector('.nav-item.active');
    return nav?.querySelector('span')?.textContent?.trim()
      || document.getElementById('pageTitle')?.textContent?.trim()
      || 'تقرير الداشبورد';
  }

  function getAppliedFilters() {
    const result = [];

    document.querySelectorAll('#filterBar .filter').forEach(box => {
      const label = box.querySelector('label')?.textContent?.trim();
      const select = box.querySelector('select');

      if (!select || !select.value) return;

      const value =
        select.options[select.selectedIndex]?.textContent?.trim()
        || select.value;

      result.push(`${label}: ${value}`);
    });

    return result;
  }

  function buildReportHeader() {
    const old = document.getElementById('vdUniversalReportHeader');
    if (old) old.remove();

    const header = document.createElement('section');
    header.id = 'vdUniversalReportHeader';
    header.className = 'vd-universal-report-header';

    const filters = getAppliedFilters();
    const now = new Date();

    header.innerHTML = `
      <div class="vd-report-brand">
        <img src="/company-logo.png" alt="Vision Dimensions">
        <div>
          <strong>شركة أبعاد الرؤية للاستشارات الهندسية</strong>
          <span>VISION DIMENSIONS ENGINEERING CONSULTANCY</span>
        </div>
      </div>

      <div class="vd-report-title">
        <small>تقرير تنفيذي</small>
        <h1>${escapeHtml(getActivePageName())}</h1>
        <p>العقد الموحد للإشراف على خدمات شبكات الطاقة — إدارة كهرباء جدة</p>
        <b>رقم العقد: 4400023827</b>
      </div>

      <div class="vd-report-meta">
        <div>
          <span>تاريخ إصدار التقرير</span>
          <b>${now.toLocaleDateString('ar-SA')}</b>
        </div>
        <div>
          <span>وقت الإصدار</span>
          <b>${now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
          })}</b>
        </div>
      </div>

      ${
        filters.length
          ? `<div class="vd-report-filters">
               <strong>الفلاتر المطبقة:</strong>
               ${filters.map(x => `<span>${escapeHtml(x)}</span>`).join('')}
             </div>`
          : `<div class="vd-report-filters">
               <strong>الفلاتر المطبقة:</strong>
               <span>جميع البيانات</span>
             </div>`
      }
    `;

    const main = document.querySelector('main');
    const activePage = document.querySelector('.page.active');

    if (main && activePage) {
      main.insertBefore(header, activePage);
    }

    return header;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function prepareCanvases() {
    document.querySelectorAll('.page.active canvas').forEach(canvas => {
      try {
        const old = canvas.parentElement?.querySelector(
          ':scope > .vd-print-canvas-image'
        );

        if (old) old.remove();

        const img = document.createElement('img');
        img.className = 'vd-print-canvas-image';
        img.src = canvas.toDataURL('image/png', 1);
        img.alt = 'Chart';

        canvas.insertAdjacentElement('afterend', img);
      } catch (_) {}
    });
  }

  function cleanupCanvases() {
    document.querySelectorAll('.vd-print-canvas-image').forEach(x => x.remove());
  }

  function exportCurrentTabReport() {
    document.body.classList.add('vd-report-print-mode');

    buildReportHeader();
    prepareCanvases();

    const oldTitle = document.title;
    const reportName = getActivePageName();

    document.title =
      `Vision Dimensions - ${reportName} - ${
        new Date().toISOString().slice(0, 10)
      }`;

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        document.title = oldTitle;
        document.body.classList.remove('vd-report-print-mode');

        document
          .getElementById('vdUniversalReportHeader')
          ?.remove();

        cleanupCanvases();
      }, 500);
    }, 300);
  }

  function install() {
    const btn = document.getElementById('printBtn');

    if (!btn) return;

    btn.textContent = '📄 تصدير تقرير PDF';
    btn.title = 'تصدير التاب الحالي كتقرير PDF';

    /*
      استبدال الزر يضمن إزالة أي listener قديم خاص بالطباعة.
    */
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', exportCurrentTabReport);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
<script lang="ts">
  let { height = 40 }: { height?: number } = $props();

  const GRID = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,7,8,7,6,0,0,0,0,0],
    [0,0,0,6,7,8,7,6,5,5,4,0,0,0],
    [0,0,5,6,7,7,6,5,5,4,3,2,0,0],
    [0,0,5,5,6,5,5,4,4,3,2,1,0,0],
    [0,4,5,5,5,4,4,3,3,2,2,1,1,0],
    [0,4,4,4,3,3,3,2,2,2,1,1,1,0],
    [0,3,4,3,3,2,2,2,1,1,1,1,1,0],
    [0,3,3,2,2,2,1,1,1,1,1,1,1,0],
    [0,0,2,2,2,1,1,1,1,1,1,1,0,0],
    [0,0,2,2,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const PAL = [null,'#001511','#003d22','#007a44','#00cc77','#44ffaa','#aaffe0','#ddfff5','#ffffff'];

  type RectData = { x: number; y: number; w: number; h: number; fill: string };

  function buildRects(ox: number, oy: number, px: number): RectData[] {
    const rects: RectData[] = [];
    for (let r = 0; r < GRID.length; r++) {
      for (let c = 0; c < GRID[r].length; c++) {
        const v = GRID[r][c];
        if (v) {
          rects.push({ x: ox + c * px, y: oy + r * px, w: px, h: px, fill: PAL[v]! });
        }
      }
    }
    return rects;
  }

  const px = 6, ox = 29, oy = 31;
  const rects = buildRects(ox, oy, px);
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 25 475 95" {height} aria-label="Materia Lab logo">
  <defs>
    <filter id="nav-bb" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <filter id="nav-mb" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    <filter id="nav-tg" x="-10%" y="-50%" width="120%" height="200%">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Glow -->
  <g class="aura">
    <ellipse cx="68" cy="70" rx="56" ry="56" fill="#00ff88" opacity="0.08" filter="url(#nav-bb)"/>
    <ellipse cx="68" cy="70" rx="36" ry="36" fill="#44ffaa" opacity="0.14" filter="url(#nav-mb)"/>
  </g>

  <!-- Orb -->
  <g shape-rendering="crispEdges">
    {#each rects as r}
      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill}/>
    {/each}
  </g>

  <!-- Divider -->
  <line x1="124" y1="30" x2="124" y2="110" stroke="#00e5a0" stroke-width="0.5" opacity="0.2"/>

  <!-- Text -->
  <text x="146" y="79"
    font-family="'Josefin Sans', sans-serif" font-weight="300" font-size="38"
    fill="#ffffff" letter-spacing="9" filter="url(#nav-tg)">MATERIA</text>
  <text x="148" y="110"
    font-family="'Josefin Sans', sans-serif" font-weight="100" font-size="26"
    fill="#44ffaa" letter-spacing="14">LAB</text>

  <!-- Horizontal rule under MATERIA -->
  <line x1="146" y1="85" x2="490" y2="85" stroke="#00e5a0" stroke-width="0.35" opacity="0.16"/>
</svg>

<style>
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.45; }
    50%      { opacity: 0.90; }
  }
  .aura { animation: glow-pulse 3.4s ease-in-out infinite; }
</style>

export function getDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI 考试数据看板</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; color: #1f2937; }
.login-wrap { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
.login-card { background: #fff; border-radius: 16px; padding: 40px 36px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 380px; width: 90%; }
.login-card h1 { font-size: 20px; margin-bottom: 8px; }
.login-card p { font-size: 13px; color: #888; margin-bottom: 20px; }
.login-card input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 16px; text-align: center; outline: none; }
.login-card input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.login-card button { width: 100%; margin-top: 16px; padding: 12px 0; background: #4f46e5; color: #fff; font-size: 16px; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; }
.login-card button:hover { background: #3730a3; }
.login-card .err { color: #dc2626; font-size: 13px; margin-top: 10px; }
.container { max-width: 1100px; margin: 0 auto; padding: 24px; }
h1 { font-size: 22px; margin-bottom: 4px; }
.sub { color: #888; font-size: 13px; margin-bottom: 20px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.logout-btn { background: none; border: 1px solid #d1d5db; color: #666; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; }
.card .icon { font-size: 28px; margin-bottom: 8px; }
.card .val { font-size: 28px; font-weight: 700; }
.card .lbl { font-size: 12px; color: #888; margin-top: 4px; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.panel h2 { font-size: 16px; margin-bottom: 14px; }
.bar { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.bar .lbl { width: 80px; font-size: 12px; text-align: right; flex-shrink: 0; }
.bar .track { flex: 1; height: 22px; background: #f3f4f6; border-radius: 6px; overflow: hidden; }
.bar .fill { height: 100%; border-radius: 6px; color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; min-width: 36px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; color: #888; font-weight: 500; font-size: 11px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
.rank { display: inline-flex; width: 22px; height: 22px; border-radius: 50%; background: #f3f4f6; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
.gold { background: #fef3c7; color: #b45309; } .silver { background: #f1f5f9; color: #475569; } .bronze { background: #ffedd5; color: #c2410c; }
.activity { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; align-items: center; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-exam { background: #4f46e5; } .dot-practice { background: #059669; }
.time { color: #888; font-size: 11px; white-space: nowrap; }
.loading { text-align: center; padding: 60px; color: #888; font-size: 16px; }
@media (max-width: 768px) { .cards { grid-template-columns: repeat(2, 1fr); } .row2 { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div id="login" class="login-wrap">
  <div class="login-card">
    <h1>🔐 数据看板</h1>
    <p>仅限管理员查看</p>
    <input id="nameInput" type="text" placeholder="输入用户名" autofocus />
    <button id="loginBtn">进入看板</button>
    <div id="loginErr" class="err"></div>
  </div>
</div>
<div id="app" class="container" style="display:none">
  <div class="topbar">
    <div><h1>AI 产品经理能力认证 · 数据看板</h1><p class="sub">使用统计概览</p></div>
    <button class="logout-btn" id="logoutBtn">退出</button>
  </div>
  <div class="loading" id="loading">加载中...</div>
  <div id="content"></div>
</div>
<script>
var ALLOWED = 'zersith';
var COLORS = { ai_capability:'#7c3aed', ai_efficiency:'#059669', ai_implement:'#4f46e5', prompt_mastery:'#d97706', data_compliance:'#dc2626' };
var LABELS = { ai_capability:{short:'能力认知'}, ai_efficiency:{short:'辅助提效'}, ai_implement:{short:'驱动落地'}, prompt_mastery:{short:'Prompt'}, data_compliance:{short:'数据合规'} };
var SUBJECTS = ['ai_capability','ai_efficiency','ai_implement','prompt_mastery','data_compliance'];

document.getElementById('loginBtn').addEventListener('click', function() {
  var name = document.getElementById('nameInput').value.trim();
  if (!name) return;
  if (name !== ALLOWED) {
    document.getElementById('loginErr').textContent = '无权访问';
    return;
  }
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = '';
  loadStats();
});
document.getElementById('nameInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('loginBtn').click();
});
document.getElementById('logoutBtn').addEventListener('click', function() {
  document.getElementById('app').style.display = 'none';
  document.getElementById('login').style.display = '';
  document.getElementById('loginErr').textContent = '';
  document.getElementById('nameInput').value = '';
});

function fmt(ts) {
  var d = new Date(ts + 'Z'), now = new Date(), diff = now - d;
  if (diff < 6e4) return '刚刚';
  if (diff < 36e5) return Math.floor(diff/6e4) + ' 分钟前';
  if (diff < 864e5) return Math.floor(diff/36e5) + ' 小时前';
  return d.toLocaleDateString('zh-CN', {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
}
function rc(i) { return i===0?'gold':i===1?'silver':i===2?'bronze':''; }

function loadStats() {
  document.getElementById('loading').style.display = '';
  document.getElementById('content').innerHTML = '';
  fetch('/api/dashboard/stats').then(function(r) { return r.json(); }).then(function(d) {
    document.getElementById('loading').style.display = 'none';
    var html = '';
    html += '<div class="cards">';
    html += '<div class="card"><div class="icon">👥</div><div class="val">'+d.totalUsers+'</div><div class="lbl">使用人数</div></div>';
    html += '<div class="card"><div class="icon">📝</div><div class="val">'+d.totalExams+'</div><div class="lbl">完成考试次数</div></div>';
    html += '<div class="card"><div class="icon">✅</div><div class="val">'+d.totalPracticeCompletions+'</div><div class="lbl">实践任务完成</div></div>';
    html += '<div class="card"><div class="icon">📊</div><div class="val">'+d.averageAccuracy+'%</div><div class="lbl">整体正确率</div></div>';
    html += '</div>';
    html += '<div class="row2">';
    html += '<div class="panel"><h2>各科目表现</h2>';
    SUBJECTS.forEach(function(s) {
      var stat = (d.subjectBreakdown||[]).find(function(x){return x.subject===s});
      var acc = stat ? stat.averageAccuracy : 0;
      html += '<div class="bar"><span class="lbl">'+(LABELS[s]?LABELS[s].short:s)+'</span><div class="track"><div class="fill" style="width:'+Math.max(acc,5)+'%;background:'+(COLORS[s]||'#6b7280')+'">'+(acc>0?acc+'%':'')+'</div></div></div>';
    });
    html += '</div>';
    html += '<div class="panel"><h2>成绩排行 Top 10</h2>';
    if (d.topPerformers.length === 0) html += '<div style="color:#888;text-align:center;padding:20px">暂无数据</div>';
    else {
      html += '<table><thead><tr><th>#</th><th>姓名</th><th>考试次数</th><th>正确率</th></tr></thead><tbody>';
      d.topPerformers.forEach(function(p,i) {
        html += '<tr><td><span class="rank '+rc(i)+'">'+(i+1)+'</span></td><td><strong>'+p.name+'</strong></td><td>'+p.examCount+'</td><td style="font-weight:600;color:'+(p.averageAccuracy>=75?'#059669':p.averageAccuracy>=60?'#d97706':'#dc2626')+'">'+p.averageAccuracy+'%</td></tr>';
      });
      html += '</tbody></table>';
    }
    html += '</div></div>';
    html += '<div class="panel"><h2>最近考试</h2>';
    if (d.recentExams.length === 0) html += '<div style="color:#888;text-align:center;padding:20px">暂无数据</div>';
    else {
      html += '<table><thead><tr><th>姓名</th><th>得分</th><th>正确率</th><th>时间</th></tr></thead><tbody>';
      d.recentExams.forEach(function(e) {
        html += '<tr><td><strong>'+e.userName+'</strong></td><td>'+e.totalScore+' / '+e.maxScore+'</td><td>'+e.accuracy+'%</td><td style="color:#888;font-size:12px">'+fmt(e.createdAt)+'</td></tr>';
      });
      html += '</tbody></table>';
    }
    html += '</div>';
    if (d.practiceStats.length > 0) {
      html += '<div class="panel"><h2>实践任务热度</h2>';
      d.practiceStats.slice(0,10).forEach(function(p,i) {
        html += '<div class="bar"><span class="lbl" style="width:auto;text-align:left">'+(i+1)+'. '+p.taskTitle+'</span><div class="track"><div class="fill" style="width:'+Math.max(p.completionCount*10,8)+'%;background:#059669">'+p.completionCount+' 人</div></div></div>';
      });
      html += '</div>';
    }
    if (d.recentActivities.length > 0) {
      html += '<div class="panel"><h2>最近动态</h2>';
      d.recentActivities.forEach(function(a) {
        html += '<div class="activity"><div class="dot '+(a.type==='exam_completed'?'dot-exam':'dot-practice')+'"></div><span><strong>'+a.userName+'</strong> '+a.description+'</span><span class="time">'+fmt(a.createdAt)+'</span></div>';
      });
      html += '</div>';
    }
    document.getElementById('content').innerHTML = html;
  }).catch(function(e) {
    document.getElementById('loading').innerHTML = '加载失败：' + e.message;
  });
}
</script>
</body>
</html>`;
}

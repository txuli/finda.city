function date() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // +1 porque enero = 0
    const year = d.getFullYear();

    const hour = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const sec = String(d.getSeconds()).padStart(2, '0');

    return `[${day}/${month}/${year} ${hour}:${min}:${sec}]`;
    ;
}

const debug=process.env.NODE_ENV


const RESET  = "\x1b[0m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RED    = "\x1b[31m";
const GRAY   = "\x1b[90m";

export function Alert(alert: string) {
  process.stdout.write(`${date()} ${YELLOW}[WARN]${RESET} ${alert}\n`);
}

export function Info(msg: string) {
  process.stdout.write(`${date()} ${CYAN}[INFO]${RESET} ${msg}\n`);
}

export function Error(msg: string) {
  process.stdout.write(`${date()} ${RED}[ERROR]${RESET} ${msg}\n`);
}

export function Debug(msg: string) {
  if (debug === "development") {
    process.stdout.write(`${date()} ${GRAY}[DEBUG]${RESET} ${msg}\n`);
  }
}

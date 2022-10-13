declare module 'kill-port' {
  export default function killPort(port: number, type: 'tcp' | 'udp'): Promise<any>;
}

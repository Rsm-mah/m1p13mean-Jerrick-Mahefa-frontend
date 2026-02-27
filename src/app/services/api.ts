export function getApiUrl(): string {
  const win = window as any;
  let url = (win.__env && win.__env.API_URL) ? win.__env.API_URL : 'http://localhost:3000';
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
    
  }
  return url;
}

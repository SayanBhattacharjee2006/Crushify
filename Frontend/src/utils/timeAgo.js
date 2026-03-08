export const timeAgo = (created) => {
    const now = new Date();
    const createdTime = new Date(created);
    const diff = Math.floor((now-createdTime)/1000);

    if(diff<60)return "just now";
    if(diff<60*60)return `${Math.floor(diff/60)} minutes ago`;
    if(diff<60*60*24)return `${Math.floor(diff/60/60)} hours ago`;
    if(diff<60*60*24*7)return `${Math.floor(diff/60/60/24)} days ago`;
    if(diff<60*60*24*30)return `${Math.floor(diff/60/60/24/7)} weeks ago`;
    if(diff<60*60*24*365)return `${Math.floor(diff/60/60/24/30)} months ago`;
    return `${Math.floor(diff/60/60/24/365)} years ago`;
}
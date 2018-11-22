const a = 1;
try {
    process.nextTick(() => {
        console.log(a);
        throw new Error('error');
    })
} catch(error) {
    console.log('puhu')
    console.log(error);
}

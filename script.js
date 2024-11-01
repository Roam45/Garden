let plantCount = 0;
let money = 0;
let seedPrice = 1;
let fencePrice = 5;
const maxFences = 10;
const fenceWidth = 30;
let fences = [];

function attackGarden(isPoisonEnemy = false) {
    const enemy = document.createElement('div');
    enemy.className = isPoisonEnemy ? 'enemy poisonEnemy' : 'enemy';
    enemy.innerText = isPoisonEnemy ? '☠️' : '⚔️';
    enemy.style.left = Math.random() * (document.getElementById('garden').clientWidth - 50) + 'px';

    document.getElementById('garden').appendChild(enemy);

    setTimeout(() => {
        enemy.style.top = (document.getElementById('garden').clientHeight - 30) + 'px';

        const checkCollision = () => {
            return fences.some(fence => {
                const fenceRect = fence.getBoundingClientRect();
                const enemyRect = enemy.getBoundingClientRect();
                return enemyRect.bottom >= fenceRect.top &&
                       enemyRect.top <= fenceRect.bottom &&
                       enemyRect.left + enemyRect.width >= fenceRect.left &&
                       enemyRect.left <= fenceRect.right;
            });
        };

        setTimeout(() => {
            if (!checkCollision()) {
                isPoisonEnemy ? wipeOutCrops() : stealMoney();
            }
            enemy.remove();
        }, 1000);
    }, 100);
}

function wipeOutCrops() {
    document.getElementById('garden').innerHTML = '';
    plantCount = 0;
    document.getElementById('seedCount').innerText = plantCount;
    document.getElementById('message').innerText = `The poison enemy wiped out all your crops!`;
}

function stealMoney() {
    const stolenAmount = Math.floor(money * 0.3);
    money -= stolenAmount;
    document.getElementById('money').innerText = money;
    document.getElementById('message').innerText = `The enemy stole $${stolenAmount}!`;
}

setInterval(() => attackGarden(false), 20000);
setInterval(() => attackGarden(true), 40000);

document.getElementById('plantButton').addEventListener('click', function() {
    plantCount++;
    const garden = document.getElementById('garden');
    const newPlant = document.createElement('div');
    newPlant.className = 'plant';
    newPlant.style.left = Math.random() * (garden.clientWidth - 50) + 'px';
    newPlant.innerText = '🌱';
    garden.appendChild(newPlant);

    setTimeout(() => {
        newPlant.style.transform = 'scale(1)';
    }, 100);

    document.getElementById('message').innerText = `You have planted ${plantCount} seeds!`;
    document.getElementById('seedCount').innerText = plantCount;
});

document.getElementById('buySeedsButton').addEventListener('click', function() {
    if (money >= seedPrice) {
        money -= seedPrice;
        document.getElementById('money').innerText = money;
        seedPrice++;
        document.getElementById('seedPrice').innerText = seedPrice;
        document.getElementById('message').innerText = `You bought better seeds!`;
    } else {
        document.getElementById('message').innerText = `Not enough money to buy seeds.`;
    }
});

document.getElementById('sellSeedsButton').addEventListener('click', function() {
    if (plantCount > 0) {
        const sellPrice = Math.floor(seedPrice / 2);
        money += sellPrice * plantCount;
        document.getElementById('money').innerText = money;
        document.getElementById('message').innerText = `You sold ${plantCount} seeds for $${sellPrice * plantCount}!`;

        document.getElementById('garden').innerHTML = '';
        plantCount = 0;
        document.getElementById('seedCount').innerText = plantCount;
    } else {
        document.getElementById('message').innerText = `No seeds to sell.`;
    }
});

document.getElementById('buyFenceButton').addEventListener('click', function() {
    if (money >= fencePrice) {
        if (fences.length < maxFences) {
            const garden = document.getElementById('garden');
            let newLeft;

            do {
                newLeft = Math.random() * (garden.clientWidth - fenceWidth);
            } while (fences.some(fence => {
                const fenceRect = fence.getBoundingClientRect();
                return newLeft < fenceRect.left + fenceWidth && newLeft + fenceWidth > fenceRect.left;
            }));

            money -= fencePrice;
            document.getElementById('money').innerText = money;

            const newFence = document.createElement('div');
            newFence.className = 'fence';
            newFence.style.left = newLeft + 'px';
            garden.appendChild(newFence);
            fences.push(newFence);

            document.getElementById('message').innerText = `You bought a wooden fence!`;

            setTimeout(() => {
                newFence.remove();
                fences = fences.filter(fence => fence !== newFence);
            }, 30000);
        } else {
            document.getElementById('message').innerText = `You can't buy more than ${maxFences} fences.`;
        }
    } else {
        document.getElementById('message').innerText = `Not enough money to buy a fence.`;
    }
});

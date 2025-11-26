import React from "react";

export default function LandingPage() {
    return (
        <main className="bg-white pb-20 pt-20 dark:bg-dark">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <h1 className="mb-6 text-heading-2 font-bold text-dark dark:text-white sm:text-heading-1">
                    Ми вітрина українських брендів
                </h1>
                <p className="mb-4 text-xl font-medium text-body">
                    Вас вітає Вітрина Listopad - де українські fashion та beauty бренди стають помітними.
                </p>
                <p className="mx-auto max-w-3xl text-lg text-body">
                    Ми збираємо найкращих виробників країни в один живий каталог, що працює як лістинговий маркетплейс: чиста сцена, на якій кожен бренд отримує світло, увагу та прямий шлях до покупця.
                </p>
                <div className="mt-8">
                    <p className="text-lg font-semibold text-dark dark:text-white">
                        Тут немає посередників — лише прямий контакт між брендом і клієнтом.
                    </p>
                </div>
            </section>

            {/* Feature Section 1: Promotion & Website Solution */}
            <section className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-2 items-center">
                <div className="order-2 md:order-1">
                    {/* Placeholder for video/image */}
                    <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-dark-2 flex items-center justify-center shadow-1">
                        <span className="text-gray-500 font-medium">Video Placeholder</span>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="mb-6 text-heading-3 font-bold text-dark dark:text-white">
                        Ми вас рекламуємо / ми приводимо вам клієнтів
                    </h2>
                    <p className="mb-4 text-lg text-body">
                        Все просто: ви створюєте продукт — ми забезпечуємо потік покупців.
                    </p>
                    <h3 className="mb-3 text-2xl font-semibold text-dark dark:text-white">
                        Немає сайту? Ми закриваємо цю проблему.
                    </h3>
                    <p className="mb-4 text-lg text-body">
                        Ваш бренд отримує власну верифіковану сторінку, яка працює як повноцінний сайт.
                    </p>
                    <ul className="list-disc pl-5 text-body space-y-2">
                        <li>Таргетуємо покупця</li>
                        <li>Та надаєм аналітику</li>
                    </ul>
                </div>
            </section>

            {/* Feature Section 2: AI Search */}
            <section className="bg-gray-1 dark:bg-dark-2 py-16">
                <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 items-center">
                    <div>
                        <h2 className="mb-6 text-heading-3 font-bold text-dark dark:text-white">
                            AI-driven пошук
                        </h2>
                        <p className="mb-4 text-lg text-body">
                            Розумний алгоритм штучного інтелекту, з’єднує бренд і покупця точніше, ніж будь-який каталог.
                        </p>
                        <p className="text-lg text-body">
                            Шукай трендові речі та луки за фото, або власним описом.
                        </p>
                    </div>
                    <div>
                        {/* Placeholder for video/image */}
                        <div className="aspect-square w-full max-w-md mx-auto rounded-lg bg-white dark:bg-dark flex items-center justify-center shadow-2">
                            <span className="text-gray-500 font-medium">AI Search Visual</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section 3: Push & Communication */}
            <section className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-2 items-center">
                <div className="order-2 md:order-1">
                    {/* Placeholder for video/image */}
                    <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-dark-2 flex items-center justify-center shadow-1">
                        <span className="text-gray-500 font-medium">Push Notifications Visual</span>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="mb-6 text-heading-3 font-bold text-dark dark:text-white">
                        Пуші та комунікація з клієнтом — на нас
                    </h2>
                    <p className="mb-4 text-lg text-body">
                        Ми повертаємо увагу, Ми вас рекламуємо, підігріваємо інтерес і мотивуємо покупця діяти.
                    </p>
                    <p className="mb-4 text-lg text-body">
                        Платформа зводить сторони - надаючи трафік. Ваша цільова аудиторія, будуть вкурсі твоїх новин.
                    </p>
                    <p className="text-lg font-medium text-dark dark:text-white">
                        Пробиваємо банерну сліпоту за допомогою розумних пуш сповіщень.
                    </p>
                </div>
            </section>

            {/* Footer Note */}
            <section className="container mx-auto px-4 py-16 text-center border-t border-gray-3 dark:border-dark-3">
                <h2 className="mb-6 text-heading-4 font-bold text-dark dark:text-white">
                    Ми не просто показуємо бренд — ми приводимо продажі.
                </h2>
                <p className="mx-auto max-w-3xl text-lg text-body">
                    Україна багата на виробників під власним імʼям, з різноманітним сегментом продукції, яку ми зберем в один каталог і покажем в зручному форматі для покупця.
                </p>
            </section>
        </main>
    );
}

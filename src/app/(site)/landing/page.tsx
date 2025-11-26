import React from "react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="bg-white pb-20 pt-20 dark:bg-dark">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <h1 className="mb-6 text-heading-2 text-dark dark:text-white sm:text-heading-1">
                    <span className="font-bold text-[#FF0080]">Listopad.</span> Вітрина українських брендів.
                </h1>
                <p className="mb-4 text-xl font-medium text-body">
                    Вас вітає Вітрина Listopad — місце, де українські fashion та beauty бренди стають видимими.
                </p>
                <p className="mx-auto max-w-3xl text-lg text-body">
                    Жодних посередників — покупець переходить напряму до вашого бренду.
                </p>
                <div className="mt-8">
                    <p className="text-lg font-semibold text-dark dark:text-white">
                        Україна має величезний потенціал локальних виробників. Ми об’єднуємо їх у зручному форматі, який спрощує відкриття брендів і підсилює довіру покупця.
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
                        Ми приводимо вам клієнтів
                    </h2>
                    <h3 className="mb-3 text-2xl font-semibold text-dark dark:text-white">
                        Все просто: ви створюєте продукт — ми забезпечуємо потік покупців.
                    </h3>
                    <ul className="list-disc pl-5 text-body space-y-2">
                        <li>Платформа генерує трафік</li>
                        <li>Ми закриваємо питання просування</li>
                        <li>и отримуєте реальних клієнтів</li>
                        <li>Ми надаємо детальну аналітику</li>
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
                            Розумний алгоритм штучного інтелекту з’єднує бренд і покупця точніше, ніж будь-який традиційний каталог.
                        </p>
                        <h3 className="mb-3 text-2xl font-semibold text-dark dark:text-white">
                            Користувач зможе:
                        </h3>
                        <ul className="list-disc pl-5 text-body space-y-2">
                            <li>шукати трендові речі за фото</li>
                            <li>шукати образи</li>
                            <li>знаходити товари за стилем або описом</li>
                            <li>отримувати релевантні рекомендації</li>
                        </ul>
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
                        Push-повідомлення та комунікація з клієнтом
                    </h2>
                    <p className="mb-4 text-lg text-body">
                        Ми повертаємо увагу покупця та допомагаємо бренду не губитися в інформаційному шумі.
                    </p>
                    <h3 className="mb-3 text-2xl font-semibold text-dark dark:text-white">
                        Платформа автоматично доставляє вашим клієнтам: релізи, нові колекції, знижки та інші важливі події.
                    </h3>
                    <p className="mb-4 text-lg text-body">
                        Пуші пробивають банерну сліпоту, завжди приходять у потрібний момент і мотивують аудиторію діяти.
                    </p>
                </div>
            </section>

            {/* Footer Note */}
            <section className="container mx-auto px-4 py-16 text-center border-t border-gray-3 dark:border-dark-3">
                <h2 className="mb-6 text-heading-4 font-bold text-dark dark:text-white">
                    Ми не просто показуємо бренд — ми приводимо продажі.
                </h2>
            </section>

        </main >
    );
}

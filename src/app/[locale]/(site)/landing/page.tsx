import React from "react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="bg-champagne pb-20 pt-20 dark:bg-dark">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <h1 className="mb-6 text-heading-2 text-onyx dark:text-white sm:text-heading-1">
                    <span className="font-bold text-[#FF0080]">Listopad.</span> Вітрина українських брендів.
                </h1>
                <p className="mb-4 text-xl font-medium text-body">
                    Вас вітає Вітрина Listopad — місце, де українські fashion та beauty бренди стають видимими.
                </p>
                <p className="mx-auto max-w-3xl text-lg text-body">
                    Жодних посередників — покупець переходить напряму до вашого бренду.
                </p>
                <div className="mt-8">
                    <p className="text-lg font-semibold text-onyx dark:text-white">
                        Україна має величезний потенціал локальних виробників. Ми об’єднуємо їх у зручному форматі, який спрощує відкриття брендів і підсилює довіру покупця.
                    </p>
                </div>
            </section>

            {/* Feature Section 1: Promotion & Website Solution */}
            <section className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-2 items-center">
                <div className="order-2 md:order-1">
                    {/* Placeholder for video/image */}
                    <div className="aspect-video w-full rounded-lg bg-champagne-300 dark:bg-dark-2 flex items-center justify-center shadow-1">
                        <span className="text-gray-500 font-medium">Video Placeholder</span>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="mb-6 text-heading-3 font-bold text-onyx dark:text-white">
                        Ми приводимо вам клієнтів
                    </h2>
                    <h3 className="mb-3 text-2xl font-semibold text-onyx dark:text-white">
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
            <section className="bg-champagne-200 dark:bg-dark-2 py-16">
                <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 items-center">
                    <div>
                        <h2 className="mb-6 text-heading-3 font-bold text-onyx dark:text-white">
                            AI-driven пошук
                        </h2>
                        <p className="mb-4 text-lg text-body">
                            Розумний алгоритм штучного інтелекту з’єднує бренд і покупця точніше, ніж будь-який традиційний каталог.
                        </p>
                        <h3 className="mb-3 text-2xl font-semibold text-onyx dark:text-white">
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
                    <div className="aspect-video w-full rounded-lg bg-champagne-300 dark:bg-dark-2 flex items-center justify-center shadow-1">
                        <span className="text-gray-500 font-medium">Push Notifications Visual</span>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="mb-6 text-heading-3 font-bold text-onyx dark:text-white">
                        Push-повідомлення та комунікація з клієнтом
                    </h2>
                    <p className="mb-4 text-lg text-body">
                        Ми повертаємо увагу покупця та допомагаємо бренду не губитися в інформаційному шумі.
                    </p>
                    <h3 className="mb-3 text-2xl font-semibold text-onyx dark:text-white">
                        Платформа автоматично доставляє вашим клієнтам: релізи, нові колекції, знижки та інші важливі події.
                    </h3>
                    <p className="mb-4 text-lg text-body">
                        Пуші пробивають банерну сліпоту, завжди приходять у потрібний момент і мотивують аудиторію діяти.
                    </p>
                </div>
            </section>

            <section className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-2 items-center">
                <div className="order-2 md:order-1">
                    {/* Placeholder for video/image */}
                    <div className="aspect-video w-full rounded-lg bg-champagne-300 dark:bg-dark-2 flex items-center justify-center shadow-1">
                        <span className="text-gray-500 font-medium">Push Notifications Visual</span>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="mb-6 text-heading-3 font-bold text-onyx dark:text-white">
                        Аналітика та інсайти для бренду
                    </h2>
                    <p className="mb-4 text-lg text-body">
                        Ми не лише приводимо трафік — ми показуємо, як саме він працює на ваш бренд.
                    </p>
                    <h3 className="mb-3 text-2xl font-semibold text-onyx dark:text-white">
                        Ви отримуєте доступ до аналітики, яка допомагає приймати рішення, а не діяти інтуїтивно:
                    </h3>
                    <ul className="list-disc pl-5 text-body space-y-2">
                        <li>перегляди сторінки бренду</li>
                        <li>перегляди окремих товарів</li>
                        <li>кліки та CTR по зовнішніх посиланнях</li>
                        <li>товари додані в обране</li>
                        <li>джерела трафіку</li>
                        <li>популярні пошукові запити та стилі, через які знаходять ваш бренд</li>
                        <li>взаємодія з рекламними та пуш кампаніями</li>
                    </ul>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="mb-12 text-center text-heading-3 font-bold text-onyx dark:text-white">
                    Часті запитання
                </h2>
                <div className="mx-auto max-w-3xl space-y-8">
                    <div className="rounded-lg bg-champagne-200 p-6 dark:bg-dark-2">
                        <h3 className="mb-3 text-xl font-bold text-onyx dark:text-white">
                            Q: Скільки це коштує для бренду?
                        </h3>
                        <p className="text-body text-lg">
                            A: Ми працюємо у форматі, який комфортний для малого та середнього бізнесу. Модель співпраці прозора: ви сплачуєте лише за реальну цінність, яку отримуєте. Детальні умови обговорюються з менеджером після заявки.
                        </p>
                    </div>
                    <div className="rounded-lg bg-champagne-200 p-6 dark:bg-dark-2">
                        <h3 className="mb-3 text-xl font-bold text-onyx dark:text-white">
                            Q: Як швидко мій бренд зʼявиться на Вітрині Listopad?
                        </h3>
                        <p className="text-body text-lg">
                            A: Після заповнення заявки та узгодження деталей бренд зазвичай виходить на платформу впродовж 24 годин — залежно від готовності контенту (фото, описи, посилання).
                        </p>
                    </div>
                    <div className="rounded-lg bg-champagne-200 p-6 dark:bg-dark-2">
                        <h3 className="mb-3 text-xl font-bold text-onyx dark:text-white">
                            Q: Ви берете відсоток з продажів?
                        </h3>
                        <p className="text-body text-lg">
                            A: Ми не виступаємо посередником у транзакції. Покупець переходить напряму на ваші канали продажу. Умови монетизації платформи для брендів узгоджуються окремо (фікс, підписка, змішана модель тощо).
                        </p>
                    </div>
                    <div className="rounded-lg bg-champagne-200 p-6 dark:bg-dark-2">
                        <h3 className="mb-3 text-xl font-bold text-onyx dark:text-white">
                            Q: Як ви приводите трафік на мій бренд?
                        </h3>
                        <p className="text-body text-lg">
                            A: Ми поєднуємо кілька каналів: SEO та видимість у Google, внутрішні добірки, AI-пошук, соцмережі, email та push-кампанії. В результаті бренд отримує цільових покупців, а не просто перегляди.
                        </p>
                    </div>
                    <div className="rounded-lg bg-champagne-200 p-6 dark:bg-dark-2">
                        <h3 className="mb-3 text-xl font-bold text-onyx dark:text-white">
                            Q: Чи є вимоги до брендів, які хочуть приєднатися?
                        </h3>
                        <p className="text-body text-lg">
                            A: Так, ми працюємо з брендами, які створюють власний продукт, дотримуються стандартів якості та мають прозору комунікацію з клієнтом. Після заявки ми коротко проводимо відбір і модерацію.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="container mx-auto px-4 py-16 text-center border-t border-champagne-400 dark:border-dark-3">
                <h2 className="mb-6 text-heading-4 font-bold text-onyx dark:text-white">
                    Ми не просто показуємо бренд — ми приводимо продажі.
                </h2>
            </section>

        </main >
    );
}

import { test, expect, Page } from "@playwright/test";
import variable from "../variable/data.json" assert { type: "json" };

test.describe.serial("Admin Flow", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto("/");

    page.on("dialog", async (dialog) => {
      console.log("Dialog:", dialog.message());
      await dialog.dismiss();
    });

    await page.getByText(variable.GlobalAdmin.role).click();
    await page.locator("a", { hasText: "บริการของคุณ" }).click();
    await page.waitForTimeout(5000);
    await page.getByText(variable.GlobalAdmin.role).click();
    await page
      .getByRole("menuitem", { name: "Admin setting" })
      .locator("a")
      .click();

    await expect(page.getByRole("main").getByText("Dashboard")).toBeVisible({
      timeout: 30_000,
    });
  });

  test("TC-147 กรณีเข้าสู่หน้าจัดการ Domain ผ่าน Global Admin", async () => {
    await page.getByRole("button", { name: "User Management" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^จัดการ Domain$/ })
      .nth(3)
      .click();

    await expect(
      page
        .locator("div")
        .filter({ hasText: /^จัดการ Domain$/ })
        .nth(3),
    ).toBeVisible();

    await expect(page.getByPlaceholder("ค้นหา")).toBeVisible();
    await expect(page.getByText("รายการทั้งหมด")).toBeVisible();
  });

  test("TC-149 ค้นหา Domain", async () => {
    await page.getByPlaceholder("ค้นหา").fill("สำนักงานนายกรัฐมนตรี");

    await expect(
      page.getByRole("cell", { name: "สำนักงานนายกรัฐมนตรี" }),
    ).toBeVisible();
  });

  test("TC-150 กดดูรายละเอียด Domain", async () => {
    await page.evaluate(() => {
      document.body.style.zoom = "50%";
    });
    await page
      .getByRole("row", { name: "สำนักงานนายกรัฐมนตรี Digital" })
      .locator("button")
      .click();

    await page
      .getByRole("listitem")
      .filter({ hasText: "ดูรายละเอียด" })
      .click();

    await expect(
      page.getByRole("heading", { name: "ข้อมูลองค์กร/หน่วยงาน" }),
    ).toBeVisible();

    await expect(page.getByRole("textbox", { name: "ค้นหา" })).toBeVisible();

    await expect(
      page.getByRole("button").filter({ hasText: /^$/ }).nth(2),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: " แก้ไขข้อมูล" }),
    ).toBeVisible();

    await expect(page.getByRole("switch")).toBeVisible();

    await expect(page.getByRole("button", { name: " Export" })).toBeVisible();

    await expect(
      page.getByRole("button", { name: " เพิ่ม User " }),
    ).toBeVisible();

    await expect(
      page.getByRole("tab", { name: "สิทธิ์การใช้ Service" }),
    ).toBeVisible();
  });

  // test("TC-151 จัดการ Domain กรณีกดปุ่ม เปิดบังคับการใช้งาน Two Authenticator", async () => {
  //   await page.getByRole("switch").click();
  //   await page.getByRole("button", { name: "ยืนยัน" }).click();
  //   await page.mouse.click(100, 200);

  //   await expect(
  //     page
  //       .locator("app-global-import-user-dialog")
  //       .getByText("ตั้งค่า Two-Factor สำเร็จ")
  //       .first(),
  //   ).toBeVisible();
  // });

  // test("TC-152 จัดการ Domain กรณีกดปุ่ม ปิดบังคับการใช้งาน Two Authenticator", async () => {
  //   await page.getByRole("switch").click();
  //   await page.getByRole("button", { name: "ยืนยัน" }).click();
  //   await page.mouse.click(100, 200);

  //   await expect(
  //     page
  //       .locator("app-global-import-user-dialog")
  //       .getByText("ตั้งค่า Two-Factor สำเร็จ")
  //       .first(),
  //   ).toBeVisible();
  // });

  test("TC-154 จัดการ Domain กรณีกดปุ่ม แก้ไข", async () => {
    await page.waitForTimeout(5000);
    await page.getByRole("button", { name: " แก้ไขข้อมูล" }).click();

    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .clear();
    await page.waitForTimeout(5000);
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .fill("สำนักงานนายกรัฐมนตรี แก้ไข");

    await page.getByRole("button", { name: "ถัดไป " }).click();
    await page.getByRole("button", { name: "บันทึก" }).click();
    await page.getByRole("button", { name: "ยืนยัน" }).click();
    await expect(
      page.getByText("สำนักงานนายกรัฐมนตรี แก้ไข").first(),
    ).toBeVisible();
    await page.waitForTimeout(7000);
    await page.getByRole("button", { name: " แก้ไขข้อมูล" }).click();
    await page.waitForTimeout(3000);
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .fill("สำนักงานนายกรัฐมนตรี");
    await page.getByRole("button", { name: "ถัดไป " }).click();
    await page.getByRole("button", { name: "บันทึก" }).click();
    await page.getByRole("button", { name: "ยืนยัน" }).click();
    await expect(page.getByText("สำนักงานนายกรัฐมนตรี")).toBeVisible();
  });

  test("TC-155 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (ไทย)* กรอกเป็นอังกฤษ", async () => {
    await page.getByRole("button", { name: " แก้ไขข้อมูล" }).click();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .fill(variable.ValidateData.english);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาไทย ตัวเลข อักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).toBeVisible();
  });

  test("TC-156 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (ไทย)* กรอกเป็นตัวเลข", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .fill(variable.ValidateData.number);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาไทย ตัวเลข อักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-157 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (ไทย)* กรอกเป็นอักขระพิเศษที่อนุญาต - _ . ( ) &", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .fill(variable.ValidateData.special);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาไทย ตัวเลข อักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-158 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (ไทย)* กรอกเป็นอักขระพิเศษที่ไม่อนุญาต", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .fill(variable.ValidateData.specialNotAllowed);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาไทย ตัวเลข อักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).toBeVisible();
  });

  test("TC-159 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (ไทย)* กรอกเป็นช่องว่าง", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (ไทย)*" })
      .fill(variable.ValidateData.space);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาไทย ตัวเลข อักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-160 แก้ไข Domain ชื่อย่อ (ไทย)* กรอกเป็นอังกฤษ", async () => {
    await page.getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" }).clear();
    await page
      .getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" })
      .fill(variable.ValidateData.english);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาไทย")).toBeVisible();
  });

  test("TC-161 แก้ไข Domain ชื่อย่อ (ไทย)* กรอกเป็นตัวเลข", async () => {
    await page.getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" }).clear();
    await page
      .getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" })
      .fill(variable.ValidateData.number);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาไทย")).toBeVisible();
  });

  test("TC-162 แก้ไข Domain ชื่อย่อ (ไทย)* กรอกเป็นอักขระพิเศษที่อนุญาต", async () => {
    await page.getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" }).clear();
    await page
      .getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" })
      .fill(variable.ValidateData.specialForAcronyms);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาไทย")).not.toBeVisible();
  });

  test("TC-163 แก้ไข Domain ชื่อย่อ (ไทย)* กรอกเป็นอักขระพิเศษที่ไม่อนุญาต", async () => {
    await page.getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" }).clear();
    await page
      .getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" })
      .fill(variable.ValidateData.specialNotAllowed);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาไทย")).toBeVisible();
  });

  test("TC-164 แก้ไข Domain ชื่อย่อ (ไทย)* กรอกเป็นช่องว่าง spacebar", async () => {
    await page.getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" }).clear();
    await page
      .getByRole("textbox", { name: "ชื่อย่อ (ไทย)*" })
      .fill(variable.ValidateData.space);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาไทย")).not.toBeVisible();
  });

  test("TC-165 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (Eng)* กรอกเป็นไทย", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .fill(variable.ValidateData.thai);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาอังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).toBeVisible();
  });

  test("TC-166 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (Eng)* กรอกเป็นตัวเลข", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .fill(variable.ValidateData.number);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาอังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-167 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (Eng)* กรอกเป็นอักขระพิเศษที่อนุญาต", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .fill(variable.ValidateData.special);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาอังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-168 แก้ไข Domain ชื่อองค์กร/หน่วยงาน (Eng)* กรอกเป็นอักขระพิเศษที่ไม่อนุญาต", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .fill(variable.ValidateData.specialNotAllowed);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาอังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).toBeVisible();
  });
  test("TC-169 แก้ไข Domainชื่อองค์กร/หน่วยงาน (Eng)* กรอกเป็นช่องว่าง spacebar", async () => {
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .clear();
    await page
      .getByRole("textbox", { name: "ชื่อองค์กร/หน่วยงาน (Eng)*" })
      .fill(variable.ValidateData.space);
    await expect(
      page.getByText(
        "กรุณากรอกเฉพาะภาษาอังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });
  test("TC-170 แก้ไข Domain ชื่อย่อ (อังกฤษ)* กรอกเป็นภาษาไทย", async () => {
    await page.getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" }).clear();
    await page
      .getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" })
      .fill(variable.ValidateData.thai);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาอังกฤษ")).toBeVisible();
  });

  test("TC-171 แก้ไข Domain ชื่อย่อ (อังกฤษ)* กรอกเป็นตัวเลข", async () => {
    await page.getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" }).clear();
    await page
      .getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" })
      .fill(variable.ValidateData.number);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาอังกฤษ")).toBeVisible();
  });

  test("TC-172 แก้ไข Domain ชื่อย่อ (อังกฤษ)* กรอกเป็นอักขระพิเศษที่อนุญาต", async () => {
    await page.getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" }).clear();
    await page
      .getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" })
      .fill(variable.ValidateData.specialForAcronyms);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาอังกฤษ")).not.toBeVisible();
  });

  test("TC-173 แก้ไข Domain ชื่อย่อ (อังกฤษ)* กรอกเป็นอักขระพิเศษที่ไม่อนุญาต", async () => {
    await page.getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" }).clear();
    await page
      .getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" })
      .fill(variable.ValidateData.specialNotAllowed);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาอังกฤษ")).toBeVisible();
  });

  test("TC-174 แก้ไข Domain ชื่อย่อ (อังกฤษ)* กรอกเป็นช่องว่าง spacebar", async () => {
    await page.getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" }).clear();
    await page
      .getByRole("textbox", { name: "กรอกชื่อย่อภาษาอังกฤษ" })
      .fill(variable.ValidateData.space);
    await expect(page.getByText("กรุณากรอกเฉพาะภาษาอังกฤษ")).not.toBeVisible();
  });

  test("TC-175 แก้ไข สังกัดของ Domain ด้วยตัวเลข", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page
      .getByRole("textbox", { name: "สังกัด*" })
      .fill(variable.ValidateData.number);
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-176 แก้ไข สังกัดของ Domain ด้วยเครื่องหมาย ( - )", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page.getByRole("textbox", { name: "สังกัด*" }).fill("-");
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });
  test("TC-177 แก้ไข สังกัดของ Domain ด้วยเครื่องหมาย ( _ ) ", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page.getByRole("textbox", { name: "สังกัด*" }).fill("_");
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-178 แก้ไข สังกัดของ Domain ด้วยเครื่องหมาย ( . )  ", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page.getByRole("textbox", { name: "สังกัด*" }).fill(".");
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-179 แก้ไข สังกัดของ Domain ด้วยเครื่องหมาย ( ( ) ) ", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page.getByRole("textbox", { name: "สังกัด*" }).fill("()");
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });
  test("TC-180 แก้ไข สังกัดของ Domain ด้วยเครื่องหมาย ( & ) ", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page.getByRole("textbox", { name: "สังกัด*" }).fill("&");
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-181 แก้ไข สังกัดของ Domain ด้วยค่าว่าง", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page.getByRole("textbox", { name: "สังกัด*" }).fill("  ");
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-182 แก้ไข สังกัดของ Domain ด้วยตัวเลข อักขระพิเศษ  - _ . ( ) & และช่องว่าง พร้อมกัน", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page
      .getByRole("textbox", { name: "สังกัด*" })
      .fill("- _ . ( ) & 123");
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).not.toBeVisible();
  });

  test("TC-183 แก้ไข สังกัดของ Domain ด้วยตัวอักษรพิเศษนอกจาก  - _ . ( ) &", async () => {
    await page.getByRole("textbox", { name: "สังกัด*" }).clear();
    await page
      .getByRole("textbox", { name: "สังกัด*" })
      .fill(variable.ValidateData.specialNotAllowed);
    await expect(
      page.getByText(
        "กรุณากรอกภาษาไทย อังกฤษ ตัวเลข หรืออักขระพิเศษ - _ . ( ) & และช่องว่างเท่านั้น",
      ),
    ).toBeVisible();
    await page
      .locator(
        ".p-ripple.p-button.p-component.p-button-icon-only.p-button-secondary",
      )
      .click();
  });

  test("TC-184 แก้ไข Domain ข้อมูล ที่อยู่", async () => {
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: " แก้ไขข้อมูล" }).click();

    await page.locator("#address").clear();
    await page.waitForTimeout(3000);
    await page
      .locator("#address")
      .fill(
        "เลขที่ 1 อาคารทำเนียบรัฐบาล ถนนพิษณุโลก แขวงดุสิต เขตดุสิต กรุงเทพมหานคร 10300 Digital Government Development Agency แก้ไข",
      );

    await page.getByRole("button", { name: "ถัดไป " }).click();
    await page.getByRole("button", { name: "บันทึก" }).click();
    await page.getByRole("button", { name: "ยืนยัน" }).click();
    await expect(
      page
        .getByText(
          "เลขที่ 1 อาคารทำเนียบรัฐบาล ถนนพิษณุโลก แขวงดุสิต เขตดุสิต กรุงเทพมหานคร 10300 Digital Government Development Agency แก้ไข",
        )
        .first(),
    ).toBeVisible();
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: " แก้ไขข้อมูล" }).click();
    await page.waitForTimeout(3000);
    await page.locator("#address").clear();
    await page
      .locator("#address")
      .fill(
        "เลขที่ 1 อาคารทำเนียบรัฐบาล ถนนพิษณุโลก แขวงดุสิต เขตดุสิต กรุงเทพมหานคร 10300 Digital Government Development Agency",
      );
    await page.getByRole("button", { name: "ถัดไป " }).click();
    await page.getByRole("button", { name: "บันทึก" }).click();
    await page.getByRole("button", { name: "ยืนยัน" }).click();
    await expect(
      page.getByText(
        "เลขที่ 1 อาคารทำเนียบรัฐบาล ถนนพิษณุโลก แขวงดุสิต เขตดุสิต กรุงเทพมหานคร 10300 Digital Government Development Agency",
      ),
    ).toBeVisible();
  });

  test("TC-185 แก้ไข Domain ข้อมูล ที่อยู่ โดยไม่กรอกข้อมูล", async () => {
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: " แก้ไขข้อมูล" }).click();
    await page.locator("#address").clear();
    await page.waitForTimeout(3000);
    await page.locator("#address").fill("");
    await expect(page.getByText('กรุณากรอกที่อยู่')).toBeVisible();
    await page.getByRole("button", { name: "ถัดไป " }).click();
    await page
      .locator(
        ".p-ripple.p-button.p-component.p-button-icon-only.p-button-secondary",
      )
      .click();
  });
});

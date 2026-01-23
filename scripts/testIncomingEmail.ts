import { readFileSync } from "fs";
import { inboundEmailHander } from "../src/lib/handlers";

const data = {
  event: "email.received",
  timestamp: "2026-01-14T22:08:06.856Z",
  email: {
    id: "inbnd_a1178376d0ba6cbf",
    messageId:
      "<CA+wQSW5Cwm04rACDBZihm2rt3c_4HWr_jYJ6iNLw=xr6Qqt8Dw@mail.gmail.com>",
    from: {
      text: '"Dylan Holland" <dylaneholland@gmail.com>',
      addresses: [
        { name: "Dylan Holland", address: "dylaneholland@gmail.com" },
      ],
    },
    to: {
      text: "mail@claudetutor.com",
      addresses: [{ name: null, address: "mail@claudetutor.com" }],
    },
    recipient: "mail@claudetutor.com",
    subject: "test",
    receivedAt: "2026-01-14T22:07:52.000Z",
    threadId: "SyL0RMhy7KWfW9F56VZ8L",
    threadPosition: 2,
    parsedData: {
      messageId:
        "<CA+wQSW5Cwm04rACDBZihm2rt3c_4HWr_jYJ6iNLw=xr6Qqt8Dw@mail.gmail.com>",
      date: "2026-01-14T22:07:52.000Z",
      subject: "test",
      from: {
        text: '"Dylan Holland" <dylaneholland@gmail.com>',
        addresses: [
          { name: "Dylan Holland", address: "dylaneholland@gmail.com" },
        ],
      },
      to: {
        text: "mail@claudetutor.com",
        addresses: [{ name: null, address: "mail@claudetutor.com" }],
      },
      cc: null,
      bcc: null,
      replyTo: null,
      textBody: "this is a test\n",
      htmlBody: '<div dir="ltr">this is a test</div>\n',
      raw: 'Return-Path: <dylaneholland@gmail.com>\r\nReceived: from mail-pl1-f180.google.com (mail-pl1-f180.google.com [209.85.214.180])\r\n by inbound-smtp.us-east-2.amazonaws.com with SMTP id 0fnblnvsehhnr6kfdqspk8pegpjs1sdnjtgvrgo1\r\n for mail@claudetutor.com;\r\n Wed, 14 Jan 2026 22:08:04 +0000 (UTC)\r\nReceived-SPF: pass (spfCheck: domain of _spf.google.com designates 209.85.214.180 as permitted sender) client-ip=209.85.214.180; envelope-from=dylaneholland@gmail.com; helo=mail-pl1-f180.google.com;\r\nAuthentication-Results: amazonses.com;\r\n spf=pass (spfCheck: domain of _spf.google.com designates 209.85.214.180 as permitted sender) client-ip=209.85.214.180; envelope-from=dylaneholland@gmail.com; helo=mail-pl1-f180.google.com;\r\n dkim=pass header.i=@gmail.com;\r\n dmarc=pass header.from=gmail.com;\r\nX-SES-RECEIPT: AEFBQUFBQUFBQUFFazRvVmY2OHpuQjNGQzJxalRHTHp2VWVTdXJHeDRvSVhBZGhwR3o5aTBqYXpRNVpNUkVDbzdnYkEyTWdlU01mOGNWT211Rzh1eTRJaStXOE85NnJ6Q1c1QTR1R0taMWpKVXZGbVplbGtCbGhZMVA1RTJuYUV0SGkvRWt3YVBOUElRMUJwRUJSYWpDSHVhckoyZXJKWEtCU3Z5VlB6YUhNei9icWdRZDZma2lXOHRKcDUyc0wvdy9SVzhWN1ZtQnBva3p3RnNvQzAySENueGR1aERMbVcyNVpyL2xEM3UyNGpsZWZ6dkpQWVpMRkJmRWhWd0dtNVk5a3AzdjV1VzZRSm5IcHVjUml6dCtYb2VYa1M3S05MVU5MV3hSYjhMWEtnNlFJbFpaSEZPZVZiZktaZ1NwaEUvS004ZXJjMHBFUzg9\r\nX-SES-DKIM-SIGNATURE: a=rsa-sha256; q=dns/txt; b=OFQVvS/aVF6RBiXK3bEwOlX2CGSQdcafXh22avuPaR4Bz6BVXxnQtC86UCYt3Qs20tV0fR+i/Q7WC0SLVJyaiOPY3bCoUBAfv8ZhXdB7uqOpo/WMPGNobcoPKw9TXZHfJrmhLPmoLm3izLceeD8X4YfrLbWSvtZGTtejutu51zc=; c=relaxed/simple; s=ndjes4mrtuzus6qxu3frw3ubo3gpjndv; d=amazonses.com; t=1768428484; v=1; bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;\r\nReceived: by mail-pl1-f180.google.com with SMTP id d9443c01a7336-2a0a95200e8so2166675ad.0\r\n        for <mail@claudetutor.com>; Wed, 14 Jan 2026 14:08:04 -0800 (PST)\r\nARC-Seal: i=1; a=rsa-sha256; t=1768428484; cv=none;\r\n        d=google.com; s=arc-20240605;\r\n        b=NjY5fKe4c3vt1fbx9X5gcurJ2oY4vfm9unVudD3L2sScwIwD8pis1fAoNshaXlrlrO\r\n         fxlqeRQYtsw3mSALa5HPMHZdKU1hkRjeBQ7GNInWr/df9YYpLNDLSScmxy2EYPLgYvaX\r\n         AYCLydYu1lEjS34FPVp0WZsz8K+wzO0vUxcwRv5Y1U48aNt4wU5k6JNbx19+unHQVfn7\r\n         t9Y/4UkioKF6MTjEQ4pcJu+2ll9qiyY2ZchwrpUwEEsTL6aPANlV61QHHTAp8639d64W\r\n         LVyu2hCCYYiyJPhzwLnXhSKpdXgrUBJzCbxByzEXoCZaqzGei5QkZkqDM0I/g3SH6rRN\r\n         tx0Q==\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;\r\n        h=to:subject:message-id:date:from:mime-version:dkim-signature;\r\n        bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=;\r\n        fh=1LeU/XksxoopWwFZeGeYCdsKI6x2S6DliuVvUXf3X7k=;\r\n        b=cy/0ZwIBwtcD04BQPwdKwG3wm06Img8/UwLoA8K2hLd79858G4ScyM92bKL9lbSxsp\r\n         C8uzPY8pJLqrwM/oAkZB23aTuf4N6PZCB6227A7qWJFZbFhU99SNcCYO5HoAkg31j/5K\r\n         rQeyb1PK5fK3Wc6AYMUZQ6Y0cSOrHZSYVHR2tRb425xFum2gyGVHFLM+rSKO3CsEBKvk\r\n         DNwCrV9qu49Amkkk6QJEgeZBiyQmWAN7EKX2ouX8EVq/rMCPy79j6kKkiJho29gO616O\r\n         uRi+pX22+h2KWyFdv5ikaSOWpWI/eHxiG34pt1yrXc0KXp0wzrJthsVXX64UaMbqO6E5\r\n         xEAw==;\r\n        darn=claudetutor.com\r\nARC-Authentication-Results: i=1; mx.google.com; arc=none\r\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n        d=gmail.com; s=20230601; t=1768428484; x=1769033284; darn=claudetutor.com;\r\n        h=to:subject:message-id:date:from:mime-version:from:to:cc:subject\r\n         :date:message-id:reply-to;\r\n        bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=;\r\n        b=jtN/ZbRjbBtE/jUD3veKZMKulbGOeupqLTzJ1ES5FmfUbFrC5Y5CHj9ML7VAwOuijv\r\n         jK7f9ng24iXMTWNEmhQ35+3Ah6GzY7W8dU0ERVqp5QgMAXsTu3GCVB2I6nKMymnJWHDO\r\n         nwDc/8E8vNdKrttvf0+7FT43fiBE64C++d7MJrySykYRkE1XkNMAGB6t5fFRBp6jxS9i\r\n         X26wi0wRZnvrzVQ93JUepk4t0TZv1bALVfTEivCKlT9+oo51JhipI9j4OdZCJTu1qD5D\r\n         55dJprZok57Kq51KlmwWc5I9iTX2Bi+IDsdPIEht3bQVA9OIQCuvWl679HPuim/JNLbA\r\n         M1xw==\r\nX-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n        d=1e100.net; s=20230601; t=1768428484; x=1769033284;\r\n        h=to:subject:message-id:date:from:mime-version:x-gm-gg\r\n         :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to;\r\n        bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=;\r\n        b=Ub7ZXP2D6b4wRfmEM4PIl9u9aDwHa/5Mj2nlhbmMm0fMq9KO64qSlW/ocu2V9EMpLo\r\n         lQX9DhEp2yd+IUK7W8zzfSPnKbFXIlqr+rb6Wu12JmQ4gJQb0SMW6hSEsmqz0cAQJ5ZM\r\n         tJcbcTPGveHcNKeOlluaMr6bYZiGJ9p7UyhsEd/9wktHd2i4gYEm34qHkqPk0j/6o1tb\r\n         LgqStyPSQHdJgsKucMc6E2gmhURaidLb/QtxS69ZCk+TH3qTh7O8Ylx8SxytHTiUaKjC\r\n         IxrO++LHH4nzfmA1UhH5klgx3v8RdNmW0uaOkqCaEZuJ6acSgHA34LlCmPE0vraxm4m1\r\n         D94A==\r\nX-Gm-Message-State: AOJu0YyCsNpXTLXKiuNh6VYiiCzYWv+Hl0AJdwakefxR7hNYSQQ3AGgW\r\n\thF8CFvsV+WbCZDlejo5t39w7XdgLMDnVdq9l1YWF9iTU+nl+fe9K47wxkhMDS66R+7I/NII+JeD\r\n\tIm8yisaoO70DvjNo/MA0ZYL1AUY6cODNq652h\r\nX-Gm-Gg: AY/fxX5ybWtjusl+UJYMwa5FU5o9cMZzwCyu+vXGSJDjj1sd+gA0jABv6Qpsw91Cwd8\r\n\t3YLm1nJQWcqsXdhzlPxoco70GnKjmshwMcvjAs+xRU2R59jrLsPmuS6NbGUU4bOl7Ju6K/ex7ae\r\n\tayLvtW+flmtzDPRMp00Cm5L2XzqTzr5Uq9e83iGnYajuxhwrTbVLCYAoxI0em/c7SDzHJDGu3nt\r\n\tFFRpeIMk4lKtu0qoEd27jAvdFADa1uhRTJ8yjx+Btj4drbamwZxGUxPqylN9lzXe2kQGTDD/XRA\r\n\t3phfSvuTJeK4q2czBPccf8XQ4jankDJGJmQ/Tr/VWXMbsSnJLdbkgOVYnus1HczQ5P/0qfUDIwp\r\n\ty8o/bcrFrpWyReLDeztEcG3oGcpCF7LgJUhGRqnkIW5NdL0M=\r\nX-Received: by 2002:a17:90b:56d0:b0:34a:b8fc:f1d1 with SMTP id\r\n 98e67ed59e1d1-3510911a1d2mr4076765a91.24.1768428483547; Wed, 14 Jan 2026\r\n 14:08:03 -0800 (PST)\r\nMIME-Version: 1.0\r\nFrom: Dylan Holland <dylaneholland@gmail.com>\r\nDate: Wed, 14 Jan 2026 16:07:52 -0600\r\nX-Gm-Features: AZwV_QhdR6YXkHdF6taJImSUuQiSnQ2w09NySmk0TTKdN9uaSotiHVu4ggX957g\r\nMessage-ID: <CA+wQSW5Cwm04rACDBZihm2rt3c_4HWr_jYJ6iNLw=xr6Qqt8Dw@mail.gmail.com>\r\nSubject: test\r\nTo: mail@claudetutor.com\r\nContent-Type: multipart/alternative; boundary="0000000000009293a406486057ee"\r\n\r\n--0000000000009293a406486057ee\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\nthis is a test\r\n\r\n--0000000000009293a406486057ee\r\nContent-Type: text/html; charset="UTF-8"\r\n\r\n<div dir="ltr">this is a test</div>\r\n\r\n--0000000000009293a406486057ee--\r\n',
      attachments: [],
      headers: {
        "return-path": {
          value: [{ address: "dylaneholland@gmail.com", name: "" }],
          html: '<span class="mp_address_group"><a href="mailto:dylaneholland@gmail.com" class="mp_address_email">dylaneholland@gmail.com</a></span>',
          text: "dylaneholland@gmail.com",
        },
        received: [
          "from mail-pl1-f180.google.com (mail-pl1-f180.google.com [209.85.214.180]) by inbound-smtp.us-east-2.amazonaws.com with SMTP id 0fnblnvsehhnr6kfdqspk8pegpjs1sdnjtgvrgo1 for mail@claudetutor.com; Wed, 14 Jan 2026 22:08:04 +0000 (UTC)",
          "by mail-pl1-f180.google.com with SMTP id d9443c01a7336-2a0a95200e8so2166675ad.0 for <mail@claudetutor.com>; Wed, 14 Jan 2026 14:08:04 -0800 (PST)",
        ],
        "received-spf":
          "pass (spfCheck: domain of _spf.google.com designates 209.85.214.180 as permitted sender) client-ip=209.85.214.180; envelope-from=dylaneholland@gmail.com; helo=mail-pl1-f180.google.com;",
        "authentication-results":
          "amazonses.com; spf=pass (spfCheck: domain of _spf.google.com designates 209.85.214.180 as permitted sender) client-ip=209.85.214.180; envelope-from=dylaneholland@gmail.com; helo=mail-pl1-f180.google.com; dkim=pass header.i=@gmail.com; dmarc=pass header.from=gmail.com;",
        "x-ses-receipt":
          "AEFBQUFBQUFBQUFFazRvVmY2OHpuQjNGQzJxalRHTHp2VWVTdXJHeDRvSVhBZGhwR3o5aTBqYXpRNVpNUkVDbzdnYkEyTWdlU01mOGNWT211Rzh1eTRJaStXOE85NnJ6Q1c1QTR1R0taMWpKVXZGbVplbGtCbGhZMVA1RTJuYUV0SGkvRWt3YVBOUElRMUJwRUJSYWpDSHVhckoyZXJKWEtCU3Z5VlB6YUhNei9icWdRZDZma2lXOHRKcDUyc0wvdy9SVzhWN1ZtQnBva3p3RnNvQzAySENueGR1aERMbVcyNVpyL2xEM3UyNGpsZWZ6dkpQWVpMRkJmRWhWd0dtNVk5a3AzdjV1VzZRSm5IcHVjUml6dCtYb2VYa1M3S05MVU5MV3hSYjhMWEtnNlFJbFpaSEZPZVZiZktaZ1NwaEUvS004ZXJjMHBFUzg9",
        "x-ses-dkim-signature":
          "a=rsa-sha256; q=dns/txt; b=OFQVvS/aVF6RBiXK3bEwOlX2CGSQdcafXh22avuPaR4Bz6BVXxnQtC86UCYt3Qs20tV0fR+i/Q7WC0SLVJyaiOPY3bCoUBAfv8ZhXdB7uqOpo/WMPGNobcoPKw9TXZHfJrmhLPmoLm3izLceeD8X4YfrLbWSvtZGTtejutu51zc=; c=relaxed/simple; s=ndjes4mrtuzus6qxu3frw3ubo3gpjndv; d=amazonses.com; t=1768428484; v=1; bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;",
        "arc-seal":
          "i=1; a=rsa-sha256; t=1768428484; cv=none; d=google.com; s=arc-20240605; b=NjY5fKe4c3vt1fbx9X5gcurJ2oY4vfm9unVudD3L2sScwIwD8pis1fAoNshaXlrlrO fxlqeRQYtsw3mSALa5HPMHZdKU1hkRjeBQ7GNInWr/df9YYpLNDLSScmxy2EYPLgYvaX AYCLydYu1lEjS34FPVp0WZsz8K+wzO0vUxcwRv5Y1U48aNt4wU5k6JNbx19+unHQVfn7 t9Y/4UkioKF6MTjEQ4pcJu+2ll9qiyY2ZchwrpUwEEsTL6aPANlV61QHHTAp8639d64W LVyu2hCCYYiyJPhzwLnXhSKpdXgrUBJzCbxByzEXoCZaqzGei5QkZkqDM0I/g3SH6rRN tx0Q==",
        "arc-message-signature":
          "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605; h=to:subject:message-id:date:from:mime-version:dkim-signature; bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=; fh=1LeU/XksxoopWwFZeGeYCdsKI6x2S6DliuVvUXf3X7k=; b=cy/0ZwIBwtcD04BQPwdKwG3wm06Img8/UwLoA8K2hLd79858G4ScyM92bKL9lbSxsp C8uzPY8pJLqrwM/oAkZB23aTuf4N6PZCB6227A7qWJFZbFhU99SNcCYO5HoAkg31j/5K rQeyb1PK5fK3Wc6AYMUZQ6Y0cSOrHZSYVHR2tRb425xFum2gyGVHFLM+rSKO3CsEBKvk DNwCrV9qu49Amkkk6QJEgeZBiyQmWAN7EKX2ouX8EVq/rMCPy79j6kKkiJho29gO616O uRi+pX22+h2KWyFdv5ikaSOWpWI/eHxiG34pt1yrXc0KXp0wzrJthsVXX64UaMbqO6E5 xEAw==; darn=claudetutor.com",
        "arc-authentication-results": "i=1; mx.google.com; arc=none",
        "dkim-signature": {
          value: "v=1",
          params: {
            a: "rsa-sha256",
            c: "relaxed/relaxed",
            d: "gmail.com",
            s: "20230601",
            t: "1768428484",
            x: "1769033284",
            darn: "claudetutor.com",
            h: "to:subject:message-id:date:from:mime-version:from:to:cc:subject :date:message-id:reply-to",
            bh: "/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=",
            b: "jtN/ZbRjbBtE/jUD3veKZMKulbGOeupqLTzJ1ES5FmfUbFrC5Y5CHj9ML7VAwOuijv jK7f9ng24iXMTWNEmhQ35+3Ah6GzY7W8dU0ERVqp5QgMAXsTu3GCVB2I6nKMymnJWHDO nwDc/8E8vNdKrttvf0+7FT43fiBE64C++d7MJrySykYRkE1XkNMAGB6t5fFRBp6jxS9i X26wi0wRZnvrzVQ93JUepk4t0TZv1bALVfTEivCKlT9+oo51JhipI9j4OdZCJTu1qD5D 55dJprZok57Kq51KlmwWc5I9iTX2Bi+IDsdPIEht3bQVA9OIQCuvWl679HPuim/JNLbA M1xw==",
          },
        },
        "x-google-dkim-signature":
          "v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20230601; t=1768428484; x=1769033284; h=to:subject:message-id:date:from:mime-version:x-gm-gg :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to; bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=; b=Ub7ZXP2D6b4wRfmEM4PIl9u9aDwHa/5Mj2nlhbmMm0fMq9KO64qSlW/ocu2V9EMpLo lQX9DhEp2yd+IUK7W8zzfSPnKbFXIlqr+rb6Wu12JmQ4gJQb0SMW6hSEsmqz0cAQJ5ZM tJcbcTPGveHcNKeOlluaMr6bYZiGJ9p7UyhsEd/9wktHd2i4gYEm34qHkqPk0j/6o1tb LgqStyPSQHdJgsKucMc6E2gmhURaidLb/QtxS69ZCk+TH3qTh7O8Ylx8SxytHTiUaKjC IxrO++LHH4nzfmA1UhH5klgx3v8RdNmW0uaOkqCaEZuJ6acSgHA34LlCmPE0vraxm4m1 D94A==",
        "x-gm-message-state":
          "AOJu0YyCsNpXTLXKiuNh6VYiiCzYWv+Hl0AJdwakefxR7hNYSQQ3AGgW hF8CFvsV+WbCZDlejo5t39w7XdgLMDnVdq9l1YWF9iTU+nl+fe9K47wxkhMDS66R+7I/NII+JeD Im8yisaoO70DvjNo/MA0ZYL1AUY6cODNq652h",
        "x-gm-gg":
          "AY/fxX5ybWtjusl+UJYMwa5FU5o9cMZzwCyu+vXGSJDjj1sd+gA0jABv6Qpsw91Cwd8 3YLm1nJQWcqsXdhzlPxoco70GnKjmshwMcvjAs+xRU2R59jrLsPmuS6NbGUU4bOl7Ju6K/ex7ae ayLvtW+flmtzDPRMp00Cm5L2XzqTzr5Uq9e83iGnYajuxhwrTbVLCYAoxI0em/c7SDzHJDGu3nt FFRpeIMk4lKtu0qoEd27jAvdFADa1uhRTJ8yjx+Btj4drbamwZxGUxPqylN9lzXe2kQGTDD/XRA 3phfSvuTJeK4q2czBPccf8XQ4jankDJGJmQ/Tr/VWXMbsSnJLdbkgOVYnus1HczQ5P/0qfUDIwp y8o/bcrFrpWyReLDeztEcG3oGcpCF7LgJUhGRqnkIW5NdL0M=",
        "x-received":
          "by 2002:a17:90b:56d0:b0:34a:b8fc:f1d1 with SMTP id 98e67ed59e1d1-3510911a1d2mr4076765a91.24.1768428483547; Wed, 14 Jan 2026 14:08:03 -0800 (PST)",
        "mime-version": "1.0",
        from: {
          value: [
            { address: "dylaneholland@gmail.com", name: "Dylan Holland" },
          ],
          html: '<span class="mp_address_group"><span class="mp_address_name">Dylan Holland</span> &lt;<a href="mailto:dylaneholland@gmail.com" class="mp_address_email">dylaneholland@gmail.com</a>&gt;</span>',
          text: '"Dylan Holland" <dylaneholland@gmail.com>',
        },
        date: "2026-01-14T22:07:52.000Z",
        "x-gm-features":
          "AZwV_QhdR6YXkHdF6taJImSUuQiSnQ2w09NySmk0TTKdN9uaSotiHVu4ggX957g",
        "message-id":
          "<CA+wQSW5Cwm04rACDBZihm2rt3c_4HWr_jYJ6iNLw=xr6Qqt8Dw@mail.gmail.com>",
        subject: "test",
        to: {
          value: [{ address: "mail@claudetutor.com", name: "" }],
          html: '<span class="mp_address_group"><a href="mailto:mail@claudetutor.com" class="mp_address_email">mail@claudetutor.com</a></span>',
          text: "mail@claudetutor.com",
        },
        "content-type": {
          value: "multipart/alternative",
          params: { boundary: "0000000000009293a406486057ee" },
        },
      },
    },
    cleanedContent: {
      html: '<div dir="ltr">this is a test</div>\n',
      text: "this is a test\n",
      hasHtml: true,
      hasText: true,
      attachments: [],
      headers: {
        "return-path": {
          value: [{ address: "dylaneholland@gmail.com", name: "" }],
          html: '<span class="mp_address_group"><a href="mailto:dylaneholland@gmail.com" class="mp_address_email">dylaneholland@gmail.com</a></span>',
          text: "dylaneholland@gmail.com",
        },
        received: [
          "from mail-pl1-f180.google.com (mail-pl1-f180.google.com [209.85.214.180]) by inbound-smtp.us-east-2.amazonaws.com with SMTP id 0fnblnvsehhnr6kfdqspk8pegpjs1sdnjtgvrgo1 for mail@claudetutor.com; Wed, 14 Jan 2026 22:08:04 +0000 (UTC)",
          "by mail-pl1-f180.google.com with SMTP id d9443c01a7336-2a0a95200e8so2166675ad.0 for <mail@claudetutor.com>; Wed, 14 Jan 2026 14:08:04 -0800 (PST)",
        ],
        "received-spf":
          "pass (spfCheck: domain of _spf.google.com designates 209.85.214.180 as permitted sender) client-ip=209.85.214.180; envelope-from=dylaneholland@gmail.com; helo=mail-pl1-f180.google.com;",
        "authentication-results":
          "amazonses.com; spf=pass (spfCheck: domain of _spf.google.com designates 209.85.214.180 as permitted sender) client-ip=209.85.214.180; envelope-from=dylaneholland@gmail.com; helo=mail-pl1-f180.google.com; dkim=pass header.i=@gmail.com; dmarc=pass header.from=gmail.com;",
        "x-ses-receipt":
          "AEFBQUFBQUFBQUFFazRvVmY2OHpuQjNGQzJxalRHTHp2VWVTdXJHeDRvSVhBZGhwR3o5aTBqYXpRNVpNUkVDbzdnYkEyTWdlU01mOGNWT211Rzh1eTRJaStXOE85NnJ6Q1c1QTR1R0taMWpKVXZGbVplbGtCbGhZMVA1RTJuYUV0SGkvRWt3YVBOUElRMUJwRUJSYWpDSHVhckoyZXJKWEtCU3Z5VlB6YUhNei9icWdRZDZma2lXOHRKcDUyc0wvdy9SVzhWN1ZtQnBva3p3RnNvQzAySENueGR1aERMbVcyNVpyL2xEM3UyNGpsZWZ6dkpQWVpMRkJmRWhWd0dtNVk5a3AzdjV1VzZRSm5IcHVjUml6dCtYb2VYa1M3S05MVU5MV3hSYjhMWEtnNlFJbFpaSEZPZVZiZktaZ1NwaEUvS004ZXJjMHBFUzg9",
        "x-ses-dkim-signature":
          "a=rsa-sha256; q=dns/txt; b=OFQVvS/aVF6RBiXK3bEwOlX2CGSQdcafXh22avuPaR4Bz6BVXxnQtC86UCYt3Qs20tV0fR+i/Q7WC0SLVJyaiOPY3bCoUBAfv8ZhXdB7uqOpo/WMPGNobcoPKw9TXZHfJrmhLPmoLm3izLceeD8X4YfrLbWSvtZGTtejutu51zc=; c=relaxed/simple; s=ndjes4mrtuzus6qxu3frw3ubo3gpjndv; d=amazonses.com; t=1768428484; v=1; bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;",
        "arc-seal":
          "i=1; a=rsa-sha256; t=1768428484; cv=none; d=google.com; s=arc-20240605; b=NjY5fKe4c3vt1fbx9X5gcurJ2oY4vfm9unVudD3L2sScwIwD8pis1fAoNshaXlrlrO fxlqeRQYtsw3mSALa5HPMHZdKU1hkRjeBQ7GNInWr/df9YYpLNDLSScmxy2EYPLgYvaX AYCLydYu1lEjS34FPVp0WZsz8K+wzO0vUxcwRv5Y1U48aNt4wU5k6JNbx19+unHQVfn7 t9Y/4UkioKF6MTjEQ4pcJu+2ll9qiyY2ZchwrpUwEEsTL6aPANlV61QHHTAp8639d64W LVyu2hCCYYiyJPhzwLnXhSKpdXgrUBJzCbxByzEXoCZaqzGei5QkZkqDM0I/g3SH6rRN tx0Q==",
        "arc-message-signature":
          "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605; h=to:subject:message-id:date:from:mime-version:dkim-signature; bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=; fh=1LeU/XksxoopWwFZeGeYCdsKI6x2S6DliuVvUXf3X7k=; b=cy/0ZwIBwtcD04BQPwdKwG3wm06Img8/UwLoA8K2hLd79858G4ScyM92bKL9lbSxsp C8uzPY8pJLqrwM/oAkZB23aTuf4N6PZCB6227A7qWJFZbFhU99SNcCYO5HoAkg31j/5K rQeyb1PK5fK3Wc6AYMUZQ6Y0cSOrHZSYVHR2tRb425xFum2gyGVHFLM+rSKO3CsEBKvk DNwCrV9qu49Amkkk6QJEgeZBiyQmWAN7EKX2ouX8EVq/rMCPy79j6kKkiJho29gO616O uRi+pX22+h2KWyFdv5ikaSOWpWI/eHxiG34pt1yrXc0KXp0wzrJthsVXX64UaMbqO6E5 xEAw==; darn=claudetutor.com",
        "arc-authentication-results": "i=1; mx.google.com; arc=none",
        "dkim-signature": {
          value: "v=1",
          params: {
            a: "rsa-sha256",
            c: "relaxed/relaxed",
            d: "gmail.com",
            s: "20230601",
            t: "1768428484",
            x: "1769033284",
            darn: "claudetutor.com",
            h: "to:subject:message-id:date:from:mime-version:from:to:cc:subject :date:message-id:reply-to",
            bh: "/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=",
            b: "jtN/ZbRjbBtE/jUD3veKZMKulbGOeupqLTzJ1ES5FmfUbFrC5Y5CHj9ML7VAwOuijv jK7f9ng24iXMTWNEmhQ35+3Ah6GzY7W8dU0ERVqp5QgMAXsTu3GCVB2I6nKMymnJWHDO nwDc/8E8vNdKrttvf0+7FT43fiBE64C++d7MJrySykYRkE1XkNMAGB6t5fFRBp6jxS9i X26wi0wRZnvrzVQ93JUepk4t0TZv1bALVfTEivCKlT9+oo51JhipI9j4OdZCJTu1qD5D 55dJprZok57Kq51KlmwWc5I9iTX2Bi+IDsdPIEht3bQVA9OIQCuvWl679HPuim/JNLbA M1xw==",
          },
        },
        "x-google-dkim-signature":
          "v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20230601; t=1768428484; x=1769033284; h=to:subject:message-id:date:from:mime-version:x-gm-gg :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to; bh=/MG9+bQyAx8M2p7zDs46o8jprarw3egEWvGjjH73Bpk=; b=Ub7ZXP2D6b4wRfmEM4PIl9u9aDwHa/5Mj2nlhbmMm0fMq9KO64qSlW/ocu2V9EMpLo lQX9DhEp2yd+IUK7W8zzfSPnKbFXIlqr+rb6Wu12JmQ4gJQb0SMW6hSEsmqz0cAQJ5ZM tJcbcTPGveHcNKeOlluaMr6bYZiGJ9p7UyhsEd/9wktHd2i4gYEm34qHkqPk0j/6o1tb LgqStyPSQHdJgsKucMc6E2gmhURaidLb/QtxS69ZCk+TH3qTh7O8Ylx8SxytHTiUaKjC IxrO++LHH4nzfmA1UhH5klgx3v8RdNmW0uaOkqCaEZuJ6acSgHA34LlCmPE0vraxm4m1 D94A==",
        "x-gm-message-state":
          "AOJu0YyCsNpXTLXKiuNh6VYiiCzYWv+Hl0AJdwakefxR7hNYSQQ3AGgW hF8CFvsV+WbCZDlejo5t39w7XdgLMDnVdq9l1YWF9iTU+nl+fe9K47wxkhMDS66R+7I/NII+JeD Im8yisaoO70DvjNo/MA0ZYL1AUY6cODNq652h",
        "x-gm-gg":
          "AY/fxX5ybWtjusl+UJYMwa5FU5o9cMZzwCyu+vXGSJDjj1sd+gA0jABv6Qpsw91Cwd8 3YLm1nJQWcqsXdhzlPxoco70GnKjmshwMcvjAs+xRU2R59jrLsPmuS6NbGUU4bOl7Ju6K/ex7ae ayLvtW+flmtzDPRMp00Cm5L2XzqTzr5Uq9e83iGnYajuxhwrTbVLCYAoxI0em/c7SDzHJDGu3nt FFRpeIMk4lKtu0qoEd27jAvdFADa1uhRTJ8yjx+Btj4drbamwZxGUxPqylN9lzXe2kQGTDD/XRA 3phfSvuTJeK4q2czBPccf8XQ4jankDJGJmQ/Tr/VWXMbsSnJLdbkgOVYnus1HczQ5P/0qfUDIwp y8o/bcrFrpWyReLDeztEcG3oGcpCF7LgJUhGRqnkIW5NdL0M=",
        "x-received":
          "by 2002:a17:90b:56d0:b0:34a:b8fc:f1d1 with SMTP id 98e67ed59e1d1-3510911a1d2mr4076765a91.24.1768428483547; Wed, 14 Jan 2026 14:08:03 -0800 (PST)",
        "mime-version": "1.0",
        from: {
          value: [
            { address: "dylaneholland@gmail.com", name: "Dylan Holland" },
          ],
          html: '<span class="mp_address_group"><span class="mp_address_name">Dylan Holland</span> &lt;<a href="mailto:dylaneholland@gmail.com" class="mp_address_email">dylaneholland@gmail.com</a>&gt;</span>',
          text: '"Dylan Holland" <dylaneholland@gmail.com>',
        },
        date: "2026-01-14T22:07:52.000Z",
        "x-gm-features":
          "AZwV_QhdR6YXkHdF6taJImSUuQiSnQ2w09NySmk0TTKdN9uaSotiHVu4ggX957g",
        "message-id":
          "<CA+wQSW5Cwm04rACDBZihm2rt3c_4HWr_jYJ6iNLw=xr6Qqt8Dw@mail.gmail.com>",
        subject: "test",
        to: {
          value: [{ address: "mail@claudetutor.com", name: "" }],
          html: '<span class="mp_address_group"><a href="mailto:mail@claudetutor.com" class="mp_address_email">mail@claudetutor.com</a></span>',
          text: "mail@claudetutor.com",
        },
        "content-type": {
          value: "multipart/alternative",
          params: { boundary: "0000000000009293a406486057ee" },
        },
      },
    },
  },
  endpoint: {
    id: "Pyv9DXUBYwD9hyUAc4Rh3",
    name: "Tutor incoming",
    type: "webhook",
  },
};

export const main = async () => {
  await inboundEmailHander(data);
};

main().then(() => {
  process.exit(0);
});
